# Sistema de Gestión de Asistencia

Aplicación fullstack para la gestión de asistencia de estudiantes en la Facultad de Informática. Sistema integral que permite registrar, monitorear y reportar la asistencia de estudiantes a las clases.

## 📋 Descripción del proyecto

Este sistema proporciona una solución completa para:
- ✅ Registrar asistencia de estudiantes a clases
- 📊 Generar reportes de asistencia
- 👥 Gestionar estudiantes y profesores
- 🏫 Administrar cursos y materias
- 📱 Interfaz web intuitiva y responsive
- 🔐 Sistema de autenticación seguro

## 🏗️ Arquitectura

El proyecto está dividido en tres componentes principales:

```
Sistema de Gestión de Asistencia
├── Frontend (React + Vite)
├── Backend (Node.js + Express)
└── Base de datos (PostgreSQL)
```

### Frontend
- **Tecnología**: React 18 con Vite
- **Puerto**: 3000
- **Características**: Interfaz responsive, componentes reutilizables
- [Ver más](./frontend/README.md)

### Backend
- **Tecnología**: Node.js con Express
- **Puerto**: 5000
- **Características**: API RESTful, autenticación JWT, validación
- [Ver más](./backend/README.md)

### Base de datos
- **Tecnología**: PostgreSQL
- **Puerto**: 5432
- **Características**: Esquema relacional optimizado

## 🚀 Inicio rápido

### Prerequisitos
- Node.js v16 o superior
- PostgreSQL 12 o superior
- Docker y Docker Compose (opcional)

### Instalación manual

#### 1. Clonar el repositorio
```bash
git clone <url-del-repositorio>
cd Proyecto-MDSS-Sistema-de-gestion-de-asistencia
```

#### 2. Configurar Base de datos
```bash
# Crear base de datos
createdb asistencia_db

# Ejecutar esquema SQL
psql -U postgres -d asistencia_db -f database/schema.sql
```

#### 3. Configurar Backend
```bash
cd backend

# Instalar dependencias
npm install

# Crear archivo .env
cp .env.example .env

# Editar .env con las credenciales correctas
# Iniciar servidor
npm run dev
```

Backend disponible en `http://localhost:5000`

#### 4. Configurar Frontend
```bash
cd frontend

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

Frontend disponible en `http://localhost:3000`

### Instalación con Docker Compose

```bash
# Copiar archivo de configuración
cp backend/.env.example backend/.env

# Iniciar todos los servicios
docker-compose up -d

# Ver logs
docker-compose logs -f
```

Servicios disponibles:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- Base de datos: localhost:5432

## 📁 Estructura del proyecto

```
.
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middleware/
│   │   └── index.js
│   ├── package.json
│   ├── .env.example
│   ├── Dockerfile
│   └── README.md
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── Dockerfile
│   ├── nginx.conf
│   └── README.md
├── database/
│   └── schema.sql
├── docs/
│   └── (documentación adicional)
├── docker-compose.yml
├── .gitignore
└── README.md
```

## 📊 Base de datos

### Tablas principales
- `users` - Usuarios del sistema (admin, profesor, estudiante)
- `students` - Información de estudiantes
- `courses` - Cursos/materias
- `enrollments` - Inscripciones de estudiantes en cursos
- `sessions` - Sesiones de clase
- `attendance` - Registros de asistencia
- `justifications` - Justificantes de ausencia
- `attendance_reports` - Reportes de asistencia

## 🔐 Autenticación

El sistema usa JWT (JSON Web Tokens) para autenticación segura.

## 📝 Endpoints principales (API)

```
GET  /api/health              - Verificar salud del servidor
POST /api/auth/login          - Login de usuario
POST /api/auth/register       - Registro de usuario
GET  /api/courses             - Listar cursos
POST /api/courses             - Crear curso
GET  /api/attendance          - Listar asistencia
POST /api/attendance          - Registrar asistencia
```

## 🛠️ Tecnologías utilizadas

### Frontend
- React 18
- Vite
- React Router DOM
- Axios
- CSS3

### Backend
- Node.js
- Express
- PostgreSQL
- jsonwebtoken (JWT)
- bcryptjs (contraseñas)

### DevOps
- Docker
- Docker Compose
- Nginx

## 📚 Documentación adicional

- [Backend - Documentación técnica](./backend/README.md)
- [Frontend - Documentación técnica](./frontend/README.md)
- [Esquema de Base de datos](./database/schema.sql)

## 🔄 Desarrollo

### Rama principal
```bash
git clone <url>
git checkout main
```

### Crear nueva rama para desarrollo
```bash
git checkout -b feature/nueva-caracteristica
```

### Commits
```bash
git add .
git commit -m "feat: descripción de cambios"
git push origin feature/nueva-caracteristica
```

## 🚀 Deployment

### Producción
1. Compilar frontend: `npm run build`
2. Usar Docker Compose en ambiente de producción
3. Configurar variables de entorno apropiadas
4. Usar HTTPS en producción
5. Configurar backup automático de BD

## 🐛 Troubleshooting

### El frontend no conecta con el backend
- Verificar que el backend está corriendo en puerto 5000
- Verificar CORS configuration en backend/.env
- Revisar consola del navegador para más detalles

### Error de conexión a base de datos
- Verificar credenciales en .env
- Asegurar que PostgreSQL está corriendo
- Verificar puerto 5432 está disponible

### Puerto ya en uso
```bash
# Cambiar puerto en .env o docker-compose.yml
# O matar proceso usando el puerto (Windows):
netstat -ano | findstr :PUERTO
taskkill /PID <PID> /F
```

## 📞 Soporte

Para reportar issues o sugerencias, crear un issue en el repositorio.

## 📄 Licencia

MIT License - ver LICENSE para más detalles

## 👥 Autores

Proyecto académico - Facultad de Informática

---

**Última actualización**: 2024

Para más información, revisar la documentación en cada carpeta del proyecto.
