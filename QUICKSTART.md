# Guía de Inicio Rápido

## 🚀 Configuración en 5 minutos

### Windows
```bash
setup.bat
```

### Linux/Mac
```bash
chmod +x setup.sh
./setup.sh
```

## 📋 Pasos manuales

### 1. Instalar dependencias

#### Backend
```bash
cd backend
npm install
cd ..
```

#### Frontend
```bash
cd frontend
npm install
cd ..
```

### 2. Configurar base de datos

```bash
# Crear base de datos
createdb asistencia_db

# Importar esquema
psql -U postgres -d asistencia_db -f database/schema.sql
```

### 3. Configurar variables de entorno

```bash
# Copiar archivo de ejemplo
cp backend/.env.example backend/.env

# Editar con tus credenciales
# Cambiar valores según tu setup local
```

### 4. Iniciar servicios

#### Terminal 1 - Backend
```bash
cd backend
npm run dev
```

Backend estará en: `http://localhost:5000`

#### Terminal 2 - Frontend
```bash
cd frontend
npm run dev
```

Frontend estará en: `http://localhost:3000`

## 🐳 Con Docker (Alternativa)

```bash
# Copiar configuración
cp backend/.env.example backend/.env

# Iniciar con Docker Compose
docker-compose up -d

# Ver logs
docker-compose logs -f
```

Servicios:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- Base de datos: localhost:5432

## ✅ Verificar que todo funciona

1. Abrir Frontend: http://localhost:3000
2. Verificar mensaje "Backend is running"
3. Backend disponible: http://localhost:5000/api/health

Si ves errores, revisar:
- Backend corriendo en puerto 5000
- PostgreSQL corriendo y accesible
- Variables de .env correctas

## 📚 Próximos pasos

- Revisar [README.md](./README.md) para documentación completa
- Ver [Backend README](./backend/README.md) para endpoints API
- Ver [Frontend README](./frontend/README.md) para estructura del código
- Revisar [CONTRIBUTING.md](./CONTRIBUTING.md) para reglas de desarrollo

## 🆘 Problemas comunes

### "Cannot connect to database"
- Verificar PostgreSQL está corriendo
- Verificar credenciales en backend/.env
- Verificar base de datos existe: `psql -l`

### "Frontend no ve el backend"
- Backend está corriendo en puerto 5000
- CORS está configurado en backend
- Check browser console para más detalles

### "Port already in use"
```bash
# Windows - matar proceso en puerto 5000
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Linux/Mac
lsof -i :5000
kill -9 <PID>
```

---

¡Listo! El proyecto está configurado y listo para desarrollar. 🎉
