import express from 'express';
import {
  captureAndSaveFingerprintProfile,
  markAttendance,
  verifyTeacherAttendance,
  exportCourseAttendanceExcel,
  exportCourseAttendancePDF
} from '../services/attendance.js';

const router = express.Router();

router.post('/attendance/fingerprint', async (req, res) => {
  try {
    const { userId, deviceId, timeoutMs } = req.body || {};
    const result = await captureAndSaveFingerprintProfile({ userId, deviceId, timeoutMs });
    return res.status(result.success ? 200 : 400).json(result);
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

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
