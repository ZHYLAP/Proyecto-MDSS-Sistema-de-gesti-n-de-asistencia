// Configuración de la conexión a PostgreSQL.
// Este módulo crea el pool de conexiones que usarán los servicios del backend.
import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

dotenv.config();

// Se crean las credenciales y opciones de conexión usando variables de entorno o valores por defecto.
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'asistencia_db'
});

// Registra errores inesperados en clientes inactivos del pool.
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

export default pool;
