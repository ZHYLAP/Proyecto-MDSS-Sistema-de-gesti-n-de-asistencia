import { useState } from 'react'
import { Icon } from '../../icons.jsx'
import { ESCENARIOS } from '../../data.js'
import { api } from '../../services/api.js'

// Panel de la Estación de Marcación (lado derecho del login).
// Muestra el sensor y, en modo demo, los botones para simular cada caso.
const TONO_CLASE = { ok: 'sim-ok', warn: 'sim-warn', bad: 'sim-bad' }

export default function SensorPanel({ estado, onSimular }) {
  const claseDisc = estado === 'leyendo' ? 'is-leyendo' : ''
  const [manualOpen, setManualOpen] = useState(false)
  const [codigo, setCodigo] = useState('')
  const [password, setPassword] = useState('')
  const [msg, setMsg] = useState('')
  const [loading, setLoading] = useState(false)

  const marcarManual = async () => {
    if (!codigo || !password) {
      setMsg('Ingresa código y contraseña para marcar.')
      return
    }
    setLoading(true)
    setMsg('')
    try {
      const res = await api.post('/attendance', { codigo, password, tipo: 'manual' })
      if (res.data?.ok) setMsg('Asistencia registrada correctamente (manual).')
      else setMsg(res.data?.error || 'No se pudo registrar la asistencia')
    } catch (err) {
      setMsg('Error de conexión con el backend.')
    } finally {
      setLoading(false)
    }
  }

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
        <div style={{ marginTop: 12, display: 'flex', gap: 8, alignItems: 'center' }}>
          <button className="app-btn ghost sm" onClick={() => setManualOpen((v) => !v)}>
            {Icon.check({ width: 14, height: 14 })} Marcar asistencia manualmente
          </button>
          {manualOpen && (
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <input className="app-input" style={{ width: 120 }} placeholder="Código" value={codigo} onChange={(e) => setCodigo(e.target.value)} />
              <input className="app-input" style={{ width: 140 }} placeholder="Contraseña" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
              <button className="app-btn" onClick={marcarManual} disabled={loading}>{loading ? 'Enviando...' : 'Marcar'}</button>
            </div>
          )}
        </div>
        <div className="sim-note">Estos botones se retirarán al conectar el sensor físico.</div>
        {msg && <div style={{ marginTop: 8 }} className="muted">{msg}</div>}
      </div>
    </div>
  )
}
