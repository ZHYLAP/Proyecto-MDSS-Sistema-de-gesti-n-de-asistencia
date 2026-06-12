import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [status, setStatus] = useState('Loading...')

  useEffect(() => {
    fetch('/api/health')
      .then(res => res.json())
      .then(data => setStatus(data.status))
      .catch(err => setStatus('Error connecting to backend'))
  }, [])

  return (
    <div className="container">
      <header>
        <h1>Sistema de Gestión de Asistencia</h1>
        <p>Facultad de Informática</p>
      </header>
      
      <main>
        <section className="intro">
          <h2>Bienvenido</h2>
          <p>Aplicación para gestionar la asistencia de estudiantes</p>
          <p className="status">Backend: {status}</p>
        </section>

        <section className="features">
          <h3>Características principales</h3>
          <ul>
            <li>📋 Registro de estudiantes</li>
            <li>✅ Control de asistencia</li>
            <li>📊 Reportes y estadísticas</li>
            <li>👨‍🏫 Gestión de docentes</li>
            <li>🏫 Administración de materias</li>
          </ul>
        </section>
      </main>

      <footer>
        <p>&copy; 2024 Sistema de Asistencia. Todos los derechos reservados.</p>
      </footer>
    </div>
  )
}

export default App
