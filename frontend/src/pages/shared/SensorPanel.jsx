import { Icon } from '../../icons.jsx'
import { ESCENARIOS } from '../../data.js'

// Panel de la Estación de Marcación (lado derecho del login).
// Muestra el sensor y, en modo demo, los botones para simular cada caso.
const TONO_CLASE = { ok: 'sim-ok', warn: 'sim-warn', bad: 'sim-bad' }

export default function SensorPanel({ estado, onSimular }) {
  const claseDisc = estado === 'leyendo' ? 'is-leyendo' : ''

  return (
    <div className="sensor-card">
      <div className="sensor-head">
        <div className="sensor-title">Estación de Marcación</div>
        <div className="sensor-sub">Coloque su huella para registrar asistencia</div>
      </div>

      <div className={`sensor-disc ${claseDisc}`}>
        {Icon.fingerprint({ width: 78, height: 78 })}
      </div>
      <div className="sensor-status">
        {estado === 'leyendo' ? 'Leyendo huella…' : 'Sensor activo · esperando'}
      </div>

      <div className="sim">
        <div className="sim-label">Modo demo · simular lectura</div>
        <div className="sim-grid">
          {ESCENARIOS.map((e) => (
            <button
              key={e.id}
              className={`sim-btn ${TONO_CLASE[e.tone]}`}
              disabled={estado === 'leyendo'}
              onClick={() => onSimular(e)}
              title={e.hint}
            >
              <span className="sim-dot" />
              <span className="sim-txt">
                <b>{e.label}</b>
                <small>{e.hint}</small>
              </span>
            </button>
          ))}
        </div>
        <div className="sim-note">Estos botones se retirarán al conectar el sensor físico.</div>
      </div>
    </div>
  )
}
