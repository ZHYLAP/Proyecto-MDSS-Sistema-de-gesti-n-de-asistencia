import { useState } from 'react'
import { Icon } from './icons.jsx'
import logoEpiis from './assets/logo-epiis.png'
import logoUnsaac from './assets/logo-unsaac.png'

import Login from './pages/Login.jsx'
import EstacionCentral from './pages/shared/EstacionCentral.jsx'

import AdminInicio from './pages/admin/AdminInicio.jsx'
import RegistrarDocente from './pages/admin/RegistrarDocente.jsx'
import ConfigHorario from './pages/admin/Tarea54_ConfigHorario.jsx'
import Tolerancia from './pages/admin/Tarea59_Tolerancia.jsx'
import Asignacion from './pages/admin/Tarea57_Asignacion.jsx'
import Monitoreo from './pages/admin/Tarea72_Monitoreo.jsx'
import Reporteria from './pages/admin/Tarea75_Reporteria.jsx'

import DocenteInicio from './pages/docente/DocenteInicio.jsx'
import PerfilDocente from './pages/docente/Tarea67_PerfilDocente.jsx'

// Menús por rol. Los grupos encabezan secciones reales del sistema.
const MENU = {
  admin: [
    { grupo: 'General', items: [{ key: 'inicio', label: 'Inicio', icon: 'home' }] },
    { grupo: 'Horarios', items: [
      { key: 'horario', label: 'Horario institucional', icon: 'clock' },
      { key: 'tolerancia', label: 'Tolerancia', icon: 'sliders' },
    ] },
    { grupo: 'Docentes', items: [
      { key: 'asignacion', label: 'Asignar cursos', icon: 'book' },
      { key: 'registrar', label: 'Registrar docente', icon: 'userPlus' },
    ] },
    { grupo: 'Reportes', items: [
      { key: 'monitoreo', label: 'Monitoreo de aulas', icon: 'monitor' },
      { key: 'reporteria', label: 'Reportería', icon: 'chart' },
    ] },
  ],
  docente: [
    { grupo: 'General', items: [
      { key: 'inicio', label: 'Inicio', icon: 'home' },
      { key: 'asistencias', label: 'Mis asistencias', icon: 'calendar' },
    ] },
  ],
}

export default function App() {
  const [session, setSession] = useState(null)
  const [page, setPage] = useState('inicio')
  const [estacion, setEstacion] = useState(false) // overlay Tarea 61

  const login = (s) => {
    setSession(s)
    setPage('inicio')
    // Simula que tras el login del docente aparece la Estación Central (ingreso institucional exitoso)
    if (s.role === 'docente') setTimeout(() => setEstacion(true), 500)
  }
  const logout = () => { setSession(null); setPage('inicio'); setEstacion(false) }

  if (!session) {
    return (
      <>
        <div className="app-bg" />
        <div className="app-root">
          <Header />
          <Login onLogin={login} />
        </div>
      </>
    )
  }

  const menu = MENU[session.role]

  const render = () => {
    if (session.role === 'admin') {
      switch (page) {
        case 'inicio': return <AdminInicio onIr={setPage} />
        case 'horario': return <ConfigHorario />
        case 'tolerancia': return <Tolerancia />
        case 'asignacion': return <Asignacion />
        case 'registrar': return <RegistrarDocente />
        case 'monitoreo': return <Monitoreo />
        case 'reporteria': return <Reporteria />
        default: return <AdminInicio onIr={setPage} />
      }
    }
    // docente
    switch (page) {
      case 'inicio': return <DocenteInicio nombre={session.nombre} onVerAsistencias={() => setPage('asistencias')} />
      case 'asistencias': return <PerfilDocente nombre={session.nombre} codigo={session.codigo} />
      default: return <DocenteInicio nombre={session.nombre} onVerAsistencias={() => setPage('asistencias')} />
    }
  }

  return (
    <>
      <div className="app-bg" />
      <div className="app-root">
        <Header session={session} onLogout={logout} />
        <div className="app-shell">
          <aside className="app-sidebar">
            {menu.map((g) => (
              <div key={g.grupo}>
                <div className="app-nav-group-label">{g.grupo}</div>
                {g.items.map((it) => (
                  <button key={it.key} className={`app-nav-item ${page === it.key ? 'is-active' : ''}`} onClick={() => setPage(it.key)}>
                    {Icon[it.icon]({ width: 18, height: 18 })} {it.label}
                  </button>
                ))}
              </div>
            ))}
          </aside>
          <main className="app-content">{render()}</main>
        </div>
      </div>

      {estacion && (
        <EstacionCentral
          escenario={{
            id: 'login', tone: 'ok', docente: session.codigo, hora: '08:41', detectado: null,
            mensajes: [{ t: 'ok', txt: 'Asistencia institucional registrada', sub: '08:41 a.m. · dentro de la hora tope (09:00)' }],
          }}
          duracion={8}
          onClose={() => setEstacion(false)}
        />
      )}
    </>
  )
}

function Header({ session, onLogout }) {
  return (
    <header className="app-header">
      <img src={logoEpiis} alt="EPIIS" />
      <div className="app-divider" />
      <img src={logoUnsaac} alt="UNSAAC" />
      <div className="app-title">
        Control de Asistencia Docente
        <span>Escuela Profesional de Ingeniería Informática y de Sistemas · UNSAAC</span>
      </div>
      {session && (
        <div className="app-user">
          <span><b>{session.nombre}</b> · {session.role === 'admin' ? 'Administrador' : 'Docente'}</span>
          <button className="app-btn ghost sm" onClick={onLogout}>
            {Icon.logout({ width: 15, height: 15 })} Salir
          </button>
        </div>
      )}
    </header>
  )
}
