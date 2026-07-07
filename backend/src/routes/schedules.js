import express from 'express';
import pool from '../config/database.js';
import { saveSchedule } from '../services/modulo.js';

const router = express.Router();

router.post('/schedules', async (req, res) => {
  const {
    newSchedule,
    existingSchedules = [],
    maxCourses = 5,
    persist = false,
    courseId
  } = req.body || {};

  const result = await saveSchedule({
    newSchedule,
    existingSchedules,
    maxCourses,
    persist,
    onPersist: persist ? async () => {
      if (!courseId) {
        throw new Error('Falta el identificador del curso para guardar el horario.');
      }

      const sessionDate = newSchedule?.sessionDate || newSchedule?.date;
      const sessionTime = newSchedule?.sessionTime || newSchedule?.start;

      if (!sessionDate || !sessionTime) {
        throw new Error('Falta la fecha o la hora de la sesión para guardar el horario.');
      }

      const query = `
        INSERT INTO sessions (course_id, session_date, session_time, topic, is_closed)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id
      `;

      const { rows } = await pool.query(query, [
        courseId,
        sessionDate,
        sessionTime,
        newSchedule?.topic || null,
        false
      ]);

      return {
        id: rows[0]?.id,
        courseId,
        sessionDate,
        sessionTime
      };
    } : undefined
  });

  if (!result.success) {
    return res.status(400).json(result);
  }

  return res.status(201).json(result);
});

export default router;
