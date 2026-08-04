// Rutas relacionadas con la captura y consulta de asistencia.
// Exponen los endpoints HTTP que el frontend usa para registrar marcaciones y exportar reportes.
import express from 'express';
import {
  captureAndSaveFingerprintProfile,
  markAttendance,
  verifyTeacherAttendance,
  exportCourseAttendanceExcel,
  exportCourseAttendancePDF
} from '../services/attendance.js';

const router = express.Router();

// Registra una plantilla biométrica para un usuario y la guarda en el sistema.
router.post('/attendance/fingerprint', async (req, res) => {
  try {
    const { userId, deviceId, timeoutMs } = req.body || {};
    const result = await captureAndSaveFingerprintProfile({ userId, deviceId, timeoutMs });
    return res.status(result.success ? 200 : 400).json(result);
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// Marca la asistencia de un estudiante o docente usando la lógica de negocio del servicio.
router.post('/attendance/mark', async (req, res) => {
  try {
    const {
      sessionId,
      studentId,
      recordedBy,
      capturedTemplate,
      role
    } = req.body || {};

    const result = await markAttendance({
      sessionId,
      studentId,
      recordedBy,
      capturedTemplate,
      role
    });

    return res.status(result.success ? 200 : 400).json(result);
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// Verifica si un docente ya registró asistencia para una sesión y fecha determinadas.
router.get('/attendance/teacher/verify', async (req, res) => {
  try {
    const { teacherId, courseId, referenceDate } = req.query || {};
    const result = await verifyTeacherAttendance({
      teacherId,
      courseId,
      referenceDate: referenceDate ? new Date(referenceDate) : undefined
    });
    return res.status(result.success ? 200 : 404).json(result);
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// Exporta el reporte de asistencia de un curso a formato Excel.
router.get('/attendance/export/excel/:courseId', async (req, res) => {
  try {
    const { courseId } = req.params;
    const exportResult = await exportCourseAttendanceExcel(courseId);

    res.setHeader('Content-Disposition', `attachment; filename="${exportResult.filename}"`);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    return res.send(exportResult.buffer);
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// Exporta el reporte de asistencia de un curso a formato PDF.
router.get('/attendance/export/pdf/:courseId', async (req, res) => {
  try {
    const { courseId } = req.params;
    const exportResult = await exportCourseAttendancePDF(courseId);

    res.setHeader('Content-Disposition', `attachment; filename="${exportResult.filename}"`);
    res.setHeader('Content-Type', 'application/pdf');
    return res.send(exportResult.buffer);
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
