@echo off
REM Script de configuración rápida para el proyecto

echo.
echo ====================================
echo   Sistema de Gestión de Asistencia
echo   Script de Configuración Rápida
echo ====================================
echo.

REM Configurar Backend
echo [1] Configurando Backend...
cd backend
if exist node_modules (
    echo Backend ya tiene node_modules instalados
) else (
    echo Instalando dependencias del backend...
    call npm install
)

if exist .env (
    echo .env ya existe en backend
) else (
    echo Creando .env desde .env.example...
    copy .env.example .env
    echo Por favor, editar backend\.env con tus credenciales
)

cd ..
echo.

REM Configurar Frontend
echo [2] Configurando Frontend...
cd frontend
if exist node_modules (
    echo Frontend ya tiene node_modules instalados
) else (
    echo Instalando dependencias del frontend...
    call npm install
)
cd ..
echo.

echo ====================================
echo Configuración completada!
echo ====================================
echo.
echo Próximos pasos:
echo.
echo 1. Editar credenciales de BD:
echo    Abrir: backend\.env
echo.
echo 2. Crear base de datos PostgreSQL:
echo    createdb asistencia_db
echo.
echo 3. Importar esquema:
echo    psql -U postgres -d asistencia_db -f database\schema.sql
echo.
echo 4. Iniciar Backend (terminal 1):
echo    cd backend
echo    npm run dev
echo.
echo 5. Iniciar Frontend (terminal 2):
echo    cd frontend
echo    npm run dev
echo.
echo Frontend: http://localhost:3000
echo Backend:  http://localhost:5000
echo.
pause
