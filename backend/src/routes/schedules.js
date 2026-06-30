import express from 'express';
import { validateSchedule } from '../services/modulo.js';

const router = express.Router();

router.post('/schedules', (req, res) => {
  const { newSchedule, existingSchedules = [], maxCourses = 5 } = req.body || {};
  const result = validateSchedule({
    newSchedule,
    existingSchedules,
    maxCourses
  });

  if (!result.isValid) {
    return res.status(400).json({
      success: false,
      message: 'No se puede guardar el horario.',
      errors: result.errors
    });
  }

  return res.status(201).json({
    success: true,
    message: 'Horario válido y listo para guardar.',
    data: {
      newSchedule,
      existingSchedules,
      maxCourses
    }
  });
});

export default router;
