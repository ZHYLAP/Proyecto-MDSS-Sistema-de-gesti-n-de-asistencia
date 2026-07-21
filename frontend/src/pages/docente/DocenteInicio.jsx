import { Icon } from '../../icons.jsx'

// Inicio del docente: sobrio. Confirma el estado del día y nada más.
// El historial completo queda detrás de un botón discreto ("Ver mis asistencias").
export default function DocenteInicio({ nombre, onVerAsistencias }) {
  return (
    <>
      <div className="app-page-head">
        <h1>Hola, {nombre?.split(' ')[0] || 'Docente'}</h1>
        <p>Este es el resumen de tu día. Miércoles, 15 de julio de 2026.</p>
      </div>

      <div className="app-grid cols-2">
        <div className="app-card">
          <h2>Asistencia institucional</h2>
          <div className="row">
            <span className="app-badge ok">Registrada</span>
            <span className="muted">Ingreso a las 08:41 a.m., dentro de la hora tope.</span>
          </div>
        </div>
        <div className="app-card">
          <h2>Curso de hoy</h2>
          <div className="row">
            <span className="app-badge ok">Registrado</span>
            <span className="muted">IF611AIN · Metodología de Desarrollo de Software · 07:00.</span>
          </div>
        </div>
      </div>

      <div className="app-card mt24" style={{ display: 'flex', alignItems: 'center' }}>
        <div>
          <div style={{ fontWeight: 600, fontSize: 14 }}>¿Quieres revisar tu historial?</div>
          <div className="muted">Todas tus marcaciones, filtros por fecha y estado.</div>
        </div>
        <div className="spacer" />
        <button className="app-btn ghost" onClick={onVerAsistencias}>
          {Icon.eye({ width: 16, height: 16 })} Ver mis asistencias
        </button>
      </div>
    </>
  )
}
