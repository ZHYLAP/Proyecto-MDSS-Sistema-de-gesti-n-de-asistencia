# Backend - Sistema de Gestión de Asistencia

Backend de la aplicación de gestión de asistencia construido con Node.js y Express.

## Requisitos previos

- Node.js v16 o superior
- PostgreSQL 12 o superior
- npm o yarn

## Instalación

1. Instalar dependencias:
```bash
npm install
```

2. Crear archivo `.env` basado en `.env.example`:
```bash
cp .env.example .env
```

3. Configurar las variables de entorno:
```env
PORT=5000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=asistencia_db
JWT_SECRET=your_jwt_secret_key
CORS_ORIGIN=http://localhost:3000
```

## Base de datos

1. Crear la base de datos PostgreSQL:
```bash
createdb asistencia_db
```

2. Ejecutar el esquema SQL:
```bash
psql -U postgres -d asistencia_db -f ../database/schema.sql
```

## Scripts disponibles

- `npm start` - Iniciar servidor en producción
- `npm run dev` - Iniciar servidor con nodemon en desarrollo
- `npm test` - Ejecutar tests

## Estructura del proyecto

```
backend/
├── src/
│   ├── config/          # Configuración (BD, etc)
│   ├── controllers/     # Controladores
│   ├── models/          # Modelos de BD
│   ├── routes/          # Rutas de la API
│   ├── middleware/      # Middleware personalizado
│   └── index.js         # Punto de entrada
├── package.json
├── .env.example
└── Dockerfile
```

## API Endpoints

### Health Check
- `GET /api/health` - Verificar estado del servidor

### Usuarios (Por implementar)
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Registro
- `GET /api/users` - Listar usuarios
- `GET /api/users/:id` - Obtener usuario

### Cursos (Por implementar)
- `GET /api/courses` - Listar cursos
- `POST /api/courses` - Crear curso
- `GET /api/courses/:id` - Obtener detalles del curso

### Asistencia (Por implementar)
- `GET /api/attendance/course/:courseId` - Listar asistencia
- `POST /api/attendance` - Registrar asistencia
- `GET /api/attendance/reports/:courseId` - Reportes

## Desarrollo

El servidor se ejecuta en `http://localhost:5000`

Para cambios en caliente durante desarrollo:
```bash
npm run dev
```

## Deployment

1. Construir con Docker:
```bash
docker build -t asistencia-backend .
```

2. Ejecutar con Docker:
```bash
docker run -p 5000:5000 --env-file .env asistencia-backend
```

O usar docker-compose desde la raíz del proyecto.

## Variables de entorno importantes

- `NODE_ENV` - Entorno (development/production)
- `JWT_SECRET` - Clave secreta para JWT
- `DB_*` - Credenciales de la base de datos
- `CORS_ORIGIN` - Origen permitido para CORS

## Licencia

MIT
