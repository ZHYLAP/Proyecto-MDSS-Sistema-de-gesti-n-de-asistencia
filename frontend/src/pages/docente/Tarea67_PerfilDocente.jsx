import { useState } from 'react'
import { Icon } from '../../icons.jsx'
import { HISTORIAL } from '../../data.js'

// Tarea 67 — Perfil del docente e historial de asistencia.
export default function PerfilDocente({ nombre = 'Rosa Quispe Mamani', codigo = 'D-1842' }) {
  const [filtro, setFiltro] = useState('todos')
  const filas = HISTORIAL.filter((h) =>
    filtro === 'todos' ? true : filtro === 'ok' ? h.estado === 'ok' : h.estado !== 'ok'
  )

  return (
    <>
      <div className="app-page-head">
        <h1>Mis asistencias</h1>
        <p>Historial de marcaciones institucionales y por curso.</p>
      </div>

      <div className="app-grid cols-4">
        <div className="app-kpi"><div className="k-label">Este mes</div><div className="k-value">18</div></div>
        <div className="app-kpi"><div className="k-label">A tiempo</div><div className="k-value" style={{ color: 'var(--ok)' }}>16</div></div>
        <div className="app-kpi"><div className="k-label">Faltas</div><div className="k-value" style={{ color: 'var(--rojo)' }}>2</div></div>
        <div className="app-kpi"><div className="k-label">Cursos activos</div><div className="k-value">3</div></div>
      </div>

      <div className="app-card mt24">
        <div className="row" style={{ marginBottom: 14 }}>
          <h2 style={{ margin: 0 }}>Historial</h2>
          <div className="spacer" />
          <button className={`app-btn sm ${filtro === 'todos' ? '' : 'ghost'}`} onClick={() => setFiltro('todos')}>Todos</button>
          <button className={`app-btn sm ${filtro === 'ok' ? '' : 'ghost'}`} onClick={() => setFiltro('ok')}>A tiempo</button>
          <button className={`app-btn sm ${filtro === 'faltas' ? '' : 'ghost'}`} onClick={() => setFiltro('faltas')}>Faltas</button>
        </div>
        <table className="app-table">
          <thead>
            <tr><th>Fecha</th><th>Tipo</th><th>Hora</th><th>Estado</th><th>Detalle</th></tr>
          </thead>
          <tbody>
            {filas.map((h, i) => (
              <tr key={i}>
                <td>{h.fecha}</td>
                <td>{h.tipo}</td>
                <td>{h.hora}</td>
                <td><span className={`app-badge ${h.estado === 'ok' ? 'ok' : 'bad'}`}>{h.estado === 'ok' ? 'Registrado' : 'Falta'}</span></td>
                <td className="muted">{h.detalle}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
