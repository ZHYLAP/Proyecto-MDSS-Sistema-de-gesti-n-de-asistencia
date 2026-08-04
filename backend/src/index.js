import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './config/database.js';
import bcrypt from 'bcryptjs';
import fs from 'fs/promises';
import path from 'path';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Ensure lightweight table for teacher attendance exists (demo/persistence)
const ensureTables = async () => {
  try {
    await pool.query(`CREATE TABLE IF NOT EXISTS teacher_attendance (
      id SERIAL PRIMARY KEY,
      codigo VARCHAR(50),
      nombre VARCHAR(255),
      tipo VARCHAR(50),
      estado VARCHAR(50),
      recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`)
    console.log('Checked teacher_attendance table')
    await pool.query(`CREATE TABLE IF NOT EXISTS app_config (
      key VARCHAR(100) PRIMARY KEY,
      value JSONB
    )`)
    console.log('Checked app_config table')
  } catch (err) {
    console.error('Error ensuring tables', err)
  }
}

ensureTables()

// Middleware
// Use permissive CORS in dev; avoid credentials:true with wildcard origin which browsers block
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Backend is running', timestamp: new Date().toISOString() });
});

// Routes
app.get('/api', (req, res) => {
  res.json({ message: 'Welcome to Asistencia API' });
});

app.post('/api/auth/login', async (req, res) => {
  const { codigo, password } = req.body || {};

  if (codigo === 'admin' && password === 'admin123') {
    return res.json({ user: { codigo: 'admin', nombre: 'Administrador EPIIS', role: 'admin' } });
  }

  if (codigo === 'D-1001' && password === 'docente123') {
    return res.json({ user: { codigo: 'D-1001', nombre: 'Waldo Elio Ibarra Zambrano', role: 'docente' } });
  }

  return res.status(401).json({ error: 'Credenciales inválidas' });
});

app.get('/api/reports', async (req, res) => {
  try {
    // First, include any persisted teacher attendance records
    const ta = await pool.query(`SELECT recorded_at::date AS fecha, nombre AS docente, '—' AS curso, tipo, to_char(recorded_at, 'HH24:MI') AS hora, estado FROM teacher_attendance ORDER BY recorded_at DESC`)
    if (ta.rows && ta.rows.length > 0) {
      return res.json(ta.rows)
    }

    // Fallback demo data when DB has no records
    const result = await pool.query(`
      SELECT '2026-07-15' AS fecha, 'Waldo Ibarra Zambrano' AS docente, 'IF611AIN' AS curso, 'Curso' AS tipo, '06:58' AS hora, 'Registrado' AS estado
      UNION ALL
      SELECT '2026-07-15', 'Dennis Candia Oviedo', '—', 'Institucional', '08:41', 'Registrado'
      UNION ALL
      SELECT '2026-07-14', 'Waldo Ibarra Zambrano', '—', 'Institucional', '09:12', 'Falta'
      UNION ALL
      SELECT '2026-07-14', 'Edwin Carrasco Poblete', 'IF552AIN', 'Curso', '08:56', 'Registrado'
      UNION ALL
      SELECT '2026-07-11', 'Julio Carbajal Luna', 'IF167AFI', 'Curso', '07:05', 'Registrado'
    `);

    res.json(result.rows);
  } catch (error) {
    console.error('Error loading reports', error);
    res.status(500).json({ error: 'No se pudieron cargar los reportes' });
  }
});

// Config endpoints
app.get('/api/config', async (req, res) => {
  try {
    const r = await pool.query("SELECT value FROM app_config WHERE key = 'schedule' LIMIT 1")
    if (r.rows && r.rows.length > 0) return res.json(r.rows[0].value)
    return res.json({ horaTope: process.env.DEFAULT_HORA_TOPE || '09:00', diasHabiles: ['L','M','X','J','V'], feriados: [] })
  } catch (err) {
    console.error('Error getting config', err)
    res.status(500).json({ error: 'No se pudo obtener la configuración' })
  }
})

app.post('/api/config', async (req, res) => {
  try {
    const payload = req.body || {}
    await pool.query(`INSERT INTO app_config (key, value) VALUES ('schedule', $1)
      ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value`, [payload])
    return res.json({ ok: true })
  } catch (err) {
    console.error('Error saving config', err)
    res.status(500).json({ error: 'No se pudo guardar la configuración' })
  }
})

// Tolerance endpoints
app.get('/api/tolerance', async (req, res) => {
  try {
    const r = await pool.query("SELECT value FROM app_config WHERE key = 'tolerance' LIMIT 1")
    if (r.rows && r.rows.length > 0) return res.json(r.rows[0].value)
    return res.json({ entradaAntes: 15, entradaDespues: 10, salidaAntes: 10, salidaDespues: 15 })
  } catch (err) {
    console.error('Error getting tolerance', err)
    res.status(500).json({ error: 'No se pudo obtener la tolerancia' })
  }
})

app.post('/api/tolerance', async (req, res) => {
  try {
    const payload = req.body || {}
    await pool.query(`INSERT INTO app_config (key, value) VALUES ('tolerance', $1) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value`, [payload])
    return res.json({ ok: true })
  } catch (err) {
    console.error('Error saving tolerance', err)
    res.status(500).json({ error: 'No se pudo guardar la tolerancia' })
  }
})

app.post('/api/teachers', async (req, res) => {
  try {
    const { codigo, nombre, dni, departamento, correo, password, huella } = req.body || {}

    if (!codigo || !nombre || !dni || !departamento || !correo || !password) {
      return res.status(400).json({ error: 'Faltan datos obligatorios' })
    }

    // Persist teacher into users table (basic fields)
    try {
      const password_hash = await bcrypt.hash(password, 10)
      const insert = await pool.query(
        'INSERT INTO users (name, email, password_hash, role) VALUES ($1,$2,$3,$4) RETURNING id, name, email, role, created_at',
        [nombre, correo, password_hash, 'profesor']
      )

      console.log('Nuevo docente registrado en BD:', insert.rows[0])
      return res.json({ ok: true, teacher: insert.rows[0] })
    } catch (dbErr) {
      console.error('Error inserting teacher into users', dbErr)
      // Unique violation
      if (dbErr && dbErr.code === '23505') {
        return res.status(409).json({ error: 'El correo ya está registrado', detail: dbErr.detail || dbErr.message })
      }

      // Fallback: persist to local JSON file so frontend can proceed while DB is down/misconfigured
      try {
        const file = path.join(process.cwd(), 'backend', 'data', 'teachers.json')
        await fs.mkdir(path.dirname(file), { recursive: true })
        let list = []
        try {
          const existing = await fs.readFile(file, 'utf8')
          list = JSON.parse(existing || '[]')
        } catch (readErr) {
          // ignore if file not present or invalid
        }
        const saved = { id: `local-${Date.now()}`, name: nombre, email: correo, role: 'profesor', created_at: new Date().toISOString() }
        list.push(saved)
        await fs.writeFile(file, JSON.stringify(list, null, 2), 'utf8')
        console.log('Saved teacher to local fallback file:', file)
        return res.json({ ok: true, teacher: saved, warning: 'Guardado en almacenamiento local (fallback) debido a error en la BD.' })
      } catch (fsErr) {
        console.error('Fallback write failed', fsErr)
        return res.status(500).json({ error: 'No se pudo guardar el docente', detail: dbErr.message })
      }
    }
  } catch (error) {
    console.error('Error creating teacher', error)
    return res.status(500).json({ error: 'No se pudo guardar el docente' })
  }
})

// List teachers (DB or fallback file)
app.get('/api/teachers', async (req, res) => {
  try {
    const r = await pool.query("SELECT id, name, email, role, created_at FROM users WHERE role = 'profesor'")
    if (r.rows && r.rows.length > 0) return res.json({ ok: true, teachers: r.rows })
  } catch (err) {
    console.error('Error querying users', err)
  }

  // fallback to local file
  try {
    const file = path.join(process.cwd(), 'backend', 'data', 'teachers.json')
    const content = await fs.readFile(file, 'utf8')
    const list = JSON.parse(content || '[]')
    return res.json({ ok: true, teachers: list })
  } catch (err) {
    console.error('Error reading fallback teachers file', err)
    return res.status(500).json({ error: 'No se pudieron cargar los docentes' })
  }
})

app.post('/api/attendance', async (req, res) => {
  try {
    const { codigo, password, tipo } = req.body || {}

    if (!codigo || !password) {
      return res.status(400).json({ error: 'Faltan código o contraseña' })
    }

    // Demo auth: accept admin and demo docente, or any provided password in this mock
    if (codigo === 'admin' && password === 'admin123') {
      console.log('Asistencia manual - admin')
    } else if (codigo === 'D-1001' && password === 'docente123') {
      console.log('Asistencia manual - D-1001')
    } else {
      console.log('Asistencia manual - credenciales temporales', { codigo })
    }

    // Persist a simple teacher attendance record for demo
    try {
      const nombre = codigo // in demo we don't resolve full name; frontend shows info
      await pool.query('INSERT INTO teacher_attendance (codigo, nombre, tipo, estado) VALUES ($1,$2,$3,$4)', [codigo, nombre, tipo || 'manual', 'Registrado'])
    } catch (e) {
      console.error('Error inserting attendance', e)
    }

    console.log('Registro de asistencia:', { codigo, tipo, timestamp: new Date().toISOString() })

    return res.json({ ok: true, message: 'Asistencia registrada' })
  } catch (error) {
    console.error('Error registering attendance', error)
    return res.status(500).json({ error: 'No se pudo registrar la asistencia' })
  }
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
