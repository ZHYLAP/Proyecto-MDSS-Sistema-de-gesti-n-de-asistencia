import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './config/database.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true
}));
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

app.post('/api/teachers', async (req, res) => {
  try {
    const { codigo, nombre, dni, departamento, correo, password, huella } = req.body || {}

    if (!codigo || !nombre || !dni || !departamento || !correo || !password) {
      return res.status(400).json({ error: 'Faltan datos obligatorios' })
    }

    console.log('Nuevo docente registrado:', { codigo, nombre, dni, departamento, correo, password, huella })

    return res.json({ ok: true, message: 'Docente registrado correctamente' })
  } catch (error) {
    console.error('Error creating teacher', error)
    return res.status(500).json({ error: 'No se pudo guardar el docente' })
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
