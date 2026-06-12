# Frontend - Sistema de Gestión de Asistencia

Frontend de la aplicación de gestión de asistencia construido con React y Vite.

## Requisitos previos

- Node.js v16 o superior
- npm o yarn

## Instalación

1. Instalar dependencias:
```bash
npm install
```

## Scripts disponibles

- `npm run dev` - Iniciar servidor de desarrollo en http://localhost:3000
- `npm run build` - Construir para producción
- `npm run preview` - Vista previa de la construcción

## Estructura del proyecto

```
frontend/
├── src/
│   ├── components/      # Componentes reutilizables
│   ├── pages/           # Páginas de la aplicación
│   ├── App.jsx          # Componente principal
│   ├── main.jsx         # Punto de entrada
│   └── index.css        # Estilos globales
├── index.html
├── package.json
├── vite.config.js
└── Dockerfile
```

## Desarrollo

1. Iniciar servidor de desarrollo:
```bash
npm run dev
```

2. La aplicación estará disponible en `http://localhost:3000`

3. El backend se espera que esté corriendo en `http://localhost:5000`

## Características principales (Por implementar)

- 👤 Autenticación de usuarios
- 📋 Panel de estudiantes
- ✅ Interfaz para marcar asistencia
- 📊 Reportes y estadísticas
- 👨‍🏫 Gestión de cursos
- 📱 Interfaz responsive

## Variables de entorno

Crear archivo `.env.local` si es necesario:
```
VITE_API_URL=http://localhost:5000/api
```

## Build para producción

```bash
npm run build
```

Los archivos compilados estarán en la carpeta `dist/`

## Deployment

Con Docker:
```bash
docker build -t asistencia-frontend .
docker run -p 3000:3000 asistencia-frontend
```

O usar docker-compose desde la raíz del proyecto.

## Tecnologías

- **React 18** - Framework UI
- **Vite** - Build tool moderno
- **React Router DOM** - Enrutamiento
- **Axios** - Cliente HTTP
- **CSS3** - Estilos

## Licencia

MIT
