// Archivo principal del backend.
// Aquí se crea la aplicación Express, se cargan las rutas y se levanta el servidor.
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import scheduleRoutes from './routes/schedules.js';
import biometricRoutes from './routes/biometric.js';
import attendanceRoutes from './routes/attendance.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware global para habilitar peticiones desde otros orígenes y leer cuerpos JSON.
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Endpoint de verificación rápida para confirmar que el backend está activo.
app.get('/api/health', (req, res) => {
  res.json({ status: 'Backend is running', timestamp: new Date().toISOString() });
});

// Ruta base de bienvenida de la API.
app.get('/api', (req, res) => {
  res.json({ message: 'Welcome to Asistencia API' });
});

// Se registran las rutas relacionadas con horarios, biometría y asistencia.
app.use('/api', scheduleRoutes);
app.use('/api', biometricRoutes);
app.use('/api', attendanceRoutes);

// Middleware de manejo de errores para responder con un mensaje claro en caso de fallos.
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// Middleware para manejar rutas no definidas con un error 404.
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Inicio del servidor en el puerto configurado.
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
