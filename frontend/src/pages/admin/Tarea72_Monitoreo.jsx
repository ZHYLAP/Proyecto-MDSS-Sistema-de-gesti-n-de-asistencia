import { Icon } from '../../icons.jsx'
import { AULAS_MONITOREO } from '../../data.js'

// Tarea 72 — Monitoreo de aulas en tiempo real. Antes era del Supervisor; ahora vive en Admin.
export default function Monitoreo() {
  const sinRegistro = AULAS_MONITOREO.filter((a) => a.estado === 'sin-registro')

  return (
    <>
      <div className="app-page-head">
        <h1>Monitoreo de aulas</h1>
        <p>Estado de las aulas con clase programada en este momento.</p>
      </div>

      {sinRegistro.length > 0 && (
        <div className="app-card" style={{ borderLeft: '4px solid var(--ambar)', marginBottom: 18 }}>
          <div className="row">
            <span style={{ color: 'var(--ambar)' }}>{Icon.alert({})}</span>
            <b>{sinRegistro.length} aula(s) sin registro de docente</b>
            <span className="muted">— revisar antes del cierre de la ventana.</span>
          </div>
        </div>
      )}

      <div className="app-grid cols-4">
        <div className="app-kpi"><div className="k-label">Aulas activas</div><div className="k-value">{AULAS_MONITOREO.length}</div></div>
        <div className="app-kpi"><div className="k-label">Con registro</div><div className="k-value" style={{ color: 'var(--ok)' }}>{AULAS_MONITOREO.length - sinRegistro.length}</div></div>
        <div className="app-kpi"><div className="k-label">Sin registro</div><div className="k-value" style={{ color: 'var(--ambar)' }}>{sinRegistro.length}</div></div>
        <div className="app-kpi"><div className="k-label">Alertas</div><div className="k-value" style={{ color: 'var(--rojo)' }}>{sinRegistro.length}</div></div>
      </div>

      <div className="app-card mt24">
        <table className="app-table">
          <thead><tr><th>Aula</th><th>Curso</th><th>Docente</th><th>Horario</th><th>Estado</th></tr></thead>
          <tbody>
            {AULAS_MONITOREO.map((a, i) => (
              <tr key={i}>
                <td>{a.aula}</td><td>{a.curso}</td><td>{a.docente}</td><td>{a.hora}</td>
                <td><span className={`app-badge ${a.estado === 'ok' ? 'ok' : 'warn'}`}>{a.estado === 'ok' ? 'Registrado' : 'Sin registro'}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
