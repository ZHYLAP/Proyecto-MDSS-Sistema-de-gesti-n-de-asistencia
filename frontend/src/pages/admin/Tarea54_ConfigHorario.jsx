import { useState } from 'react'
import { CONFIG_INSTITUCIONAL } from '../../data.js'

const DIAS = [
  { l: 'L', nombre: 'Lunes' }, { l: 'M', nombre: 'Martes' }, { l: 'X', nombre: 'Miércoles' },
  { l: 'J', nombre: 'Jueves' }, { l: 'V', nombre: 'Viernes' }, { l: 'S', nombre: 'Sábado' }, { l: 'D', nombre: 'Domingo' },
]

// Tarea 54 — Horario institucional.
// Regla final: hora tope editable (09:00 por defecto). Pasada esa hora => FALTA. NO existe tardanza.
export default function ConfigHorario() {
  const [horaTope, setHoraTope] = useState(CONFIG_INSTITUCIONAL.horaTope)
  const [dias, setDias] = useState(new Set(CONFIG_INSTITUCIONAL.diasHabiles))
  const [feriados, setFeriados] = useState(['28 jul — Fiestas Patrias', '29 jul — Fiestas Patrias'])

  const toggleDia = (l) => {
    const s = new Set(dias)
    s.has(l) ? s.delete(l) : s.add(l)
    setDias(s)
  }

  return (
    <>
      <div className="app-page-head">
        <h1>Horario institucional</h1>
        <p>Hora tope de ingreso y días hábiles. Pasada la hora tope, el ingreso cuenta como falta.</p>
      </div>

      <div className="app-grid cols-2">
        <div className="app-card">
          <h2>Hora tope de ingreso</h2>
          <div className="app-field" style={{ maxWidth: 180 }}>
            <label>Hora tope (editable)</label>
            <input className="app-input" type="time" value={horaTope} onChange={(e) => setHoraTope(e.target.value)} />
          </div>
          <div className="app-badge warn" style={{ display: 'inline-block' }}>
            Sin tardanza: después de {horaTope} el ingreso es falta y requiere contactar al Director de Escuela.
          </div>
          <div className="mt16">
            <div className="muted" style={{ marginBottom: 6 }}>Vista previa de la ventana</div>
            <div className="preview-window" />
            <div className="row" style={{ justifyContent: 'space-between', fontSize: 11, color: 'var(--gris)', marginTop: 4 }}>
              <span>Apertura</span><span>Válido</span><span>{horaTope} tope</span>
            </div>
          </div>
        </div>

        <div className="app-card">
          <h2>Días hábiles</h2>
          <div className="row wrap">
            {DIAS.map((d) => (
              <button key={d.l} className={`app-chip dia ${dias.has(d.l) ? '' : ''}`}
                style={{ cursor: 'pointer', background: dias.has(d.l) ? 'var(--azul)' : 'var(--azul-claro)', color: dias.has(d.l) ? '#fff' : 'var(--azul)' }}
                onClick={() => toggleDia(d.l)} title={d.nombre}>
                {d.l}
              </button>
            ))}
          </div>
          <div className="muted mt16">Activos por defecto: Lunes a Viernes.</div>
        </div>
      </div>

      <div className="app-card mt24">
        <h2>Excepciones y feriados</h2>
        <div className="row wrap">
          {feriados.map((f, i) => (
            <span key={i} className="app-chip">
              {f}
              <span style={{ cursor: 'pointer', marginLeft: 4 }} onClick={() => setFeriados(feriados.filter((_, j) => j !== i))}>×</span>
            </span>
          ))}
          <button className="app-btn ghost sm" onClick={() => setFeriados([...feriados, 'Nuevo feriado'])}>+ Agregar</button>
        </div>
      </div>

      <div className="row end mt24">
        <button className="app-btn">Guardar configuración</button>
      </div>
    </>
  )
}
