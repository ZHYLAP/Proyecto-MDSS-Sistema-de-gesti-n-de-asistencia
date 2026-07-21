import { Icon } from '../../icons.jsx'

const ACCESOS = [
  { key: 'horario', icon: 'clock', titulo: 'Horario institucional', desc: 'Hora tope y días hábiles' },
  { key: 'tolerancia', icon: 'sliders', titulo: 'Tolerancia', desc: 'Ventanas de marcación por curso' },
  { key: 'asignacion', icon: 'book', titulo: 'Asignar cursos', desc: 'Cursos por docente (1 a 5)' },
  { key: 'registrar', icon: 'userPlus', titulo: 'Registrar docente', desc: 'Datos y enrolar huella' },
  { key: 'monitoreo', icon: 'monitor', titulo: 'Monitoreo de aulas', desc: 'Aulas sin registro en tiempo real' },
  { key: 'reporteria', icon: 'chart', titulo: 'Reportería', desc: 'Filtros y exportación' },
]

export default function AdminInicio({ onIr }) {
  return (
    <>
      <div className="app-page-head">
        <h1>Panel del administrador</h1>
        <p>Configuración del sistema y monitoreo de asistencia.</p>
      </div>

      <div className="app-grid cols-4">
        <div className="app-kpi"><div className="k-label">Docentes activos</div><div className="k-value">42</div></div>
        <div className="app-kpi"><div className="k-label">Marcaciones hoy</div><div className="k-value" style={{ color: 'var(--ok)' }}>128</div></div>
        <div className="app-kpi"><div className="k-label">Aulas sin registro</div><div className="k-value" style={{ color: 'var(--ambar)' }}>2</div></div>
        <div className="app-kpi"><div className="k-label">Hora tope</div><div className="k-value">09:00</div></div>
      </div>

      <div className="app-grid cols-3 mt24">
        {ACCESOS.map((a) => (
          <button key={a.key} className="app-card" style={{ textAlign: 'left', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.6)' }} onClick={() => onIr(a.key)}>
            <div className="row" style={{ marginBottom: 8 }}>
              <span style={{ background: 'var(--azul-claro)', color: 'var(--azul)', borderRadius: 10, padding: 8, display: 'inline-flex' }}>{Icon[a.icon]({})}</span>
            </div>
            <div style={{ fontWeight: 700, fontSize: 15 }}>{a.titulo}</div>
            <div className="muted">{a.desc}</div>
          </button>
        ))}
      </div>
    </>
  )
}
