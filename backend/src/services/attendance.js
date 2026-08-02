import crypto from 'node:crypto';
import ExcelJS from 'exceljs';
import PDFDocument from 'pdfkit';
import pool from '../config/database.js';
import { createBiometricService, hashFingerprintTemplate } from './biometric.js';

const BIOMETRIC_SECRET = process.env.BIOMETRIC_SECRET || process.env.JWT_SECRET || 'asistencia-secret';

export function hashFingerprint(template) {
  if (!template || typeof template !== 'string') {
    throw new Error('La plantilla biométrica debe ser una cadena válida.');
  }

  const hmac = crypto.createHmac('sha256', BIOMETRIC_SECRET);
  hmac.update(template);
  return hmac.digest('hex');
}

export function isAfterNineAM(value = new Date()) {
  const timestamp = new Date(value);
  if (Number.isNaN(timestamp.getTime())) {
    return false;
  }

  const hour = timestamp.getHours();
  const minute = timestamp.getMinutes();
  const second = timestamp.getSeconds();
  const milliseconds = timestamp.getMilliseconds();

  return hour > 9 || (hour === 9 && (minute > 0 || second > 0 || milliseconds > 0));
}

export function classifyAttendance({ markedAt, officialStart, earlyToleranceMinutes = 15, lateToleranceMinutes = 10 }) {
  const markedDate = new Date(markedAt);
  const officialDate = new Date(officialStart);

  if (Number.isNaN(markedDate.getTime()) || Number.isNaN(officialDate.getTime())) {
    return {
      allowed: false,
      status: 'rechazado',
      differenceMinutes: null,
      message: 'Las fechas de marcación o el inicio oficial no son válidos.'
    };
  }

  const differenceMinutes = Math.round((markedDate.getTime() - officialDate.getTime()) / 60000);

  if (differenceMinutes < 0) {
    const earlyDifference = Math.abs(differenceMinutes);
    if (earlyDifference > Number(earlyToleranceMinutes)) {
      return {
        allowed: false,
        status: 'rechazado',
        differenceMinutes,
        message: 'La marcación es demasiado anticipada para la sesión.'
      };
    }

    return {
      allowed: true,
      status: 'presente',
      differenceMinutes,
      message: 'Marcación temprana permitida dentro del margen de tolerancia.'
    };
  }

  if (differenceMinutes === 0) {
    return {
      allowed: true,
      status: 'presente',
      differenceMinutes,
      message: 'Marcación puntual a la hora oficial.'
    };
  }

  if (differenceMinutes <= Number(lateToleranceMinutes)) {
    return {
      allowed: true,
      status: 'tardanza',
      differenceMinutes,
      message: 'Marcación tardía dentro del margen institucional.'
    };
  }

  return {
    allowed: false,
    status: 'rechazado',
    differenceMinutes,
    message: 'La marcación supera el margen de tolerancia tardía institucional.'
  };
}

export function buildSessionStart(sessionDate, sessionTime) {
  if (!sessionDate || !sessionTime) {
    return null;
  }

  const datePart = typeof sessionDate === 'string'
    ? sessionDate.slice(0, 10)
    : sessionDate.toISOString().slice(0, 10);
  const timePart = String(sessionTime).trim().slice(0, 8);
  return `${datePart}T${timePart}`;
}

export async function saveFingerprintProfile({ userId, fingerprintTemplate }) {
  if (!userId) {
    throw new Error('El userId es obligatorio para guardar un perfil biométrico.');
  }
  if (!fingerprintTemplate || typeof fingerprintTemplate !== 'string') {
    throw new Error('Se requiere una plantilla biométrica válida para guardar.');
  }

  const templateHash = hashFingerprintTemplate(fingerprintTemplate);
  const query = `
    INSERT INTO fingerprints (user_id, template_hash, created_at)
    VALUES ($1, $2, CURRENT_TIMESTAMP)
    ON CONFLICT (user_id) DO UPDATE SET template_hash = EXCLUDED.template_hash, created_at = EXCLUDED.created_at
    RETURNING id, user_id, template_hash, created_at
  `;

  const { rows } = await pool.query(query, [userId, templateHash]);
  return rows[0];
}

export async function verifyFingerprintProfile({ userId, capturedTemplate }) {
  if (!userId) {
    throw new Error('El userId es obligatorio para verificar el perfil biométrico.');
  }
  if (!capturedTemplate || typeof capturedTemplate !== 'string') {
    return {
      success: false,
      match: false,
      message: 'Se requiere una plantilla capturada para la verificación.'
    };
  }

  const query = 'SELECT template_hash FROM fingerprints WHERE user_id = $1 LIMIT 1';
  const { rows } = await pool.query(query, [userId]);
  const profile = rows[0];

  if (!profile) {
    return {
      success: false,
      match: false,
      message: 'No existe un perfil biométrico registrado para este usuario.'
    };
  }

  const capturedHash = hashFingerprintTemplate(capturedTemplate);
  const match = capturedHash === profile.template_hash;

  return {
    success: match,
    match,
    message: match
      ? 'La plantilla capturada coincide con el perfil registrado.'
      : 'La plantilla capturada no coincide con el perfil registrado.'
  };
}

export async function getSessionById(sessionId) {
  if (!sessionId) {
    return null;
  }

  const query = `
    SELECT
      s.id AS session_id,
      s.course_id,
      s.session_date,
      s.session_time,
      s.topic,
      c.professor_id,
      c.name AS course_name,
      c.code AS course_code
    FROM sessions s
    JOIN courses c ON c.id = s.course_id
    WHERE s.id = $1
    LIMIT 1
  `;

  const { rows } = await pool.query(query, [sessionId]);
  return rows[0] || null;
}

export async function markAttendance({ sessionId, studentId, recordedBy = null, capturedTemplate = null, role = 'student' } = {}) {
  const session = await getSessionById(sessionId);
  if (!session) {
    return {
      success: false,
      message: 'No se encontró la sesión indicada.',
      status: 'rechazado'
    };
  }

  const officialStart = buildSessionStart(session.session_date, session.session_time);
  const recordedAt = new Date();

  const classification = classifyAttendance({
    markedAt: recordedAt.toISOString(),
    officialStart,
    earlyToleranceMinutes: 15,
    lateToleranceMinutes: 10
  });

  const afterNineAM = isAfterNineAM(recordedAt);

  if (!classification.allowed) {
    return {
      success: false,
      status: classification.status,
      message: classification.message,
      differenceMinutes: classification.differenceMinutes,
      afterNineAM,
      recordedAt: recordedAt.toISOString()
    };
  }

  if (capturedTemplate && studentId) {
    const fingerprintVerification = await verifyFingerprintProfile({ userId: studentId, capturedTemplate });
    if (!fingerprintVerification.success) {
      return {
        success: false,
        message: fingerprintVerification.message,
        status: 'rechazado',
        afterNineAM,
        recordedAt: recordedAt.toISOString()
      };
    }
  }

  let attendanceRecord = null;

  if (studentId) {
    const query = `
      INSERT INTO attendance (session_id, student_id, status, notes, recorded_at, recorded_by)
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT (session_id, student_id) DO UPDATE
      SET status = EXCLUDED.status,
          notes = EXCLUDED.notes,
          recorded_at = EXCLUDED.recorded_at,
          recorded_by = EXCLUDED.recorded_by
      RETURNING id, session_id, student_id, status, recorded_at
    `;

    const notes = role === 'profesor'
      ? 'Marcación de profesor registrada en el sistema.'
      : 'Marcación de estudiante registrada en el sistema.';

    const { rows } = await pool.query(query, [
      session.session_id,
      studentId,
      classification.status,
      notes,
      recordedAt,
      recordedBy
    ]);

    attendanceRecord = rows[0];
  }

  return {
    success: true,
    status: classification.status,
    message: classification.message,
    differenceMinutes: classification.differenceMinutes,
    afterNineAM,
    recordedAt: recordedAt.toISOString(),
    session: {
      id: session.session_id,
      courseId: session.course_id,
      courseName: session.course_name,
      courseCode: session.course_code,
      topic: session.topic
    },
    attendanceRecord
  };
}

export async function verifyTeacherAttendance({ teacherId, courseId, referenceDate = new Date() } = {}) {
  if (!teacherId || !courseId) {
    throw new Error('Se requieren teacherId y courseId para verificar asistencia de docente.');
  }

  const referenceDay = referenceDate.toISOString().slice(0, 10);
  const query = `
    SELECT
      s.id AS session_id,
      s.course_id,
      s.session_date,
      s.session_time,
      s.topic,
      c.name AS course_name,
      c.code AS course_code
    FROM sessions s
    JOIN courses c ON c.id = s.course_id
    WHERE c.professor_id = $1
      AND c.id = $2
      AND s.session_date = $3
    ORDER BY s.session_time
    LIMIT 1
  `;

  const { rows } = await pool.query(query, [teacherId, courseId, referenceDay]);
  if (!rows[0]) {
    return {
      success: false,
      exists: false,
      message: 'No hay sesión programada para este docente y curso en la fecha indicada.'
    };
  }

  const session = rows[0];
  const officialStart = buildSessionStart(session.session_date, session.session_time);
  const classification = classifyAttendance({
    markedAt: referenceDate.toISOString(),
    officialStart,
    earlyToleranceMinutes: 15,
    lateToleranceMinutes: 10
  });

  return {
    success: classification.allowed,
    exists: true,
    session: {
      id: session.session_id,
      courseId: session.course_id,
      courseName: session.course_name,
      courseCode: session.course_code,
      topic: session.topic,
      sessionDate: session.session_date,
      sessionTime: session.session_time
    },
    classification,
    message: classification.allowed
      ? 'La asistencia docente está dentro del margen institucional.'
      : 'La asistencia docente no cumple el margen institucional.'
  };
}

export async function getAttendanceReportByCourse(courseId) {
  if (!courseId) {
    throw new Error('El courseId es obligatorio para generar el reporte.');
  }

  const query = `
    SELECT
      s.id AS session_id,
      s.session_date,
      s.session_time,
      s.topic,
      a.status,
      a.notes,
      a.recorded_at,
      st.id AS student_id,
      st.first_name,
      st.last_name,
      st.email,
      c.name AS course_name,
      c.code AS course_code
    FROM sessions s
    JOIN courses c ON c.id = s.course_id
    LEFT JOIN attendance a ON a.session_id = s.id
    LEFT JOIN students st ON st.id = a.student_id
    WHERE s.course_id = $1
    ORDER BY s.session_date, s.session_time, st.last_name, st.first_name
  `;

  const { rows } = await pool.query(query, [courseId]);
  const courseInfo = rows.length > 0
    ? { name: rows[0].course_name, code: rows[0].course_code }
    : null;

  const records = rows.map((row) => ({
    sessionId: row.session_id,
    sessionDate: row.session_date,
    sessionTime: row.session_time,
    topic: row.topic,
    status: row.status,
    notes: row.notes,
    recordedAt: row.recorded_at,
    studentId: row.student_id,
    studentName: row.student_id ? `${row.first_name || ''} ${row.last_name || ''}`.trim() : null,
    studentEmail: row.email
  }));

  const summary = {
    totalRecords: records.length,
    totalPresent: records.filter((record) => record.status === 'presente').length,
    totalLate: records.filter((record) => record.status === 'tardanza').length,
    totalAbsent: records.filter((record) => record.status === 'ausente').length,
    totalJustified: records.filter((record) => record.status === 'justificado').length
  };

  return {
    course: courseInfo,
    summary,
    records
  };
}

export async function exportCourseAttendanceExcel(courseId) {
  const report = await getAttendanceReportByCourse(courseId);
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Reporte de Asistencia');

  sheet.columns = [
    { header: 'Curso', key: 'course', width: 30 },
    { header: 'Código', key: 'courseCode', width: 20 },
    { header: 'Fecha sesión', key: 'sessionDate', width: 15 },
    { header: 'Hora sesión', key: 'sessionTime', width: 12 },
    { header: 'Tema', key: 'topic', width: 30 },
    { header: 'Estudiante', key: 'studentName', width: 30 },
    { header: 'Correo', key: 'studentEmail', width: 30 },
    { header: 'Estado', key: 'status', width: 15 },
    { header: 'Observaciones', key: 'notes', width: 30 },
    { header: 'Registrado a las', key: 'recordedAt', width: 25 }
  ];

  report.records.forEach((record) => {
    sheet.addRow({
      course: report.course?.name || '',
      courseCode: report.course?.code || '',
      sessionDate: record.sessionDate ? record.sessionDate.toISOString().slice(0, 10) : '',
      sessionTime: record.sessionTime || '',
      topic: record.topic || '',
      studentName: record.studentName || 'Sin estudiante registrado',
      studentEmail: record.studentEmail || '',
      status: record.status || 'pendiente',
      notes: record.notes || '',
      recordedAt: record.recordedAt ? new Date(record.recordedAt).toISOString() : ''
    });
  });

  const buffer = await workbook.xlsx.writeBuffer();
  return {
    buffer,
    filename: `${report.course?.code || 'curso'}-asistencia.xlsx`
  };
}

export async function exportCourseAttendancePDF(courseId) {
  const report = await getAttendanceReportByCourse(courseId);
  const doc = new PDFDocument({ size: 'A4', margin: 40 });
  const chunks = [];

  doc.on('data', (chunk) => chunks.push(chunk));

  doc.fontSize(18).text('Reporte de Asistencia', { align: 'center' });
  doc.moveDown();
  doc.fontSize(12).text(`Curso: ${report.course?.name || 'N/A'}`);
  doc.text(`Código: ${report.course?.code || 'N/A'}`);
  doc.text(`Generado: ${new Date().toISOString()}`);
  doc.moveDown();

  const headerY = doc.y;
  doc.fontSize(10).text('Fecha', 40, headerY, { width: 70, continued: true });
  doc.text('Hora', 110, headerY, { width: 55, continued: true });
  doc.text('Estudiante', 165, headerY, { width: 140, continued: true });
  doc.text('Estado', 305, headerY, { width: 80, continued: true });
  doc.text('Registrado', 385, headerY, { width: 150 });
  doc.moveDown(0.5);

  report.records.forEach((record) => {
    const rowY = doc.y;
    doc.text(record.sessionDate ? record.sessionDate.toISOString().slice(0, 10) : 'N/A', 40, rowY, { width: 70, continued: true });
    doc.text(record.sessionTime || 'N/A', 110, rowY, { width: 55, continued: true });
    doc.text(record.studentName || 'Sin estudiante', 165, rowY, { width: 140, continued: true });
    doc.text(record.status || 'pendiente', 305, rowY, { width: 80, continued: true });
    doc.text(record.recordedAt ? new Date(record.recordedAt).toISOString() : '', 385, rowY, { width: 150 });
    doc.moveDown(0.8);

    if (doc.y > 720) {
      doc.addPage();
    }
  });

  doc.end();
  const buffer = Buffer.concat(chunks);

  return {
    buffer,
    filename: `${report.course?.code || 'curso'}-asistencia.pdf`
  };
}

export async function captureAndSaveFingerprintProfile({ userId, deviceId, timeoutMs } = {}) {
  const biometricService = await createBiometricService();
  const captureResult = await biometricService.captureFingerprint({ deviceId, timeoutMs });

  if (!captureResult.success) {
    return captureResult;
  }

  const profile = await saveFingerprintProfile({
    userId,
    fingerprintTemplate: captureResult.template
  });

  return {
    success: true,
    profile,
    capture: captureResult
  };
}
