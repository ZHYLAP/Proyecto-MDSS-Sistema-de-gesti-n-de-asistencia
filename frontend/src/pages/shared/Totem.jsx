import { useState, useEffect, useRef } from 'react'
import { Icon } from '../../icons.jsx'

// Tarea 81 — Tótem físico reactivo. Estados: reposo → leyendo → resultado → reposo (7s).
// Resultados posibles: curso ok, curso encadenado (salida+entrada), fuera de hora, institucional.
const RESULTADOS = [
  { clase: 'is-ok',   icon: 'check', msg: 'Se registró su asistencia al curso', detalle: 'IF-451 · Metodologías de Desarrollo de Software' },
  { clase: 'is-ok',   icon: 'check', msg: 'Salida y entrada registradas',        detalle: 'Curso encadenado: IF-333 → IF-451 en una sola marca' },
  { clase: 'is-ok',   icon: 'check', msg: 'Asistencia institucional registrada', detalle: 'Ingreso dentro de la hora tope' },
  { clase: 'is-warn', icon: 'alert', msg: 'Fuera de hora',                        detalle: 'Registro no válido. Contacte al Director de Escuela' },
]

export default function Totem({ compact = false }) {
  const [estado, setEstado] = useState('reposo') // reposo | leyendo | resultado
  const [res, setRes] = useState(null)
  const [count, setCount] = useState(0)
  const timers = useRef([])

  const limpiar = () => { timers.current.forEach(clearTimeout); timers.current = [] }
  useEffect(() => () => limpiar(), [])

  const marcar = () => {
    if (estado === 'leyendo') return
    limpiar()
    setEstado('leyendo')
    setRes(null)
    timers.current.push(setTimeout(() => {
      const r = RESULTADOS[Math.floor(Math.random() * RESULTADOS.length)]
      setRes(r)
      setEstado('resultado')
      setCount(7)
      // cuenta atrás visible
      let n = 7
      const iv = setInterval(() => {
        n -= 1
        setCount(n)
        if (n <= 0) { clearInterval(iv); setEstado('reposo'); setRes(null) }
      }, 1000)
      timers.current.push(iv)
    }, 1600))
  }

  const claseDisc =
    estado === 'leyendo' ? 'is-leyendo'
    : estado === 'resultado' ? (res?.clase || '')
    : ''

  const icono =
    estado === 'resultado' && res ? Icon[res.icon]
    : Icon.fingerprint

  return (
    <div className={`totem ${claseDisc}`} style={compact ? { width: 300 } : undefined}>
      <div className="t-brand">Estación de Marcación</div>
      <div className="t-sub">UNSAAC · Control de Asistencia Docente</div>

      <div className="t-disc">{icono({})}</div>

      <div className="t-msg">
        {estado === 'reposo' && 'Coloque su huella'}
        {estado === 'leyendo' && 'Leyendo huella…'}
        {estado === 'resultado' && res?.msg}
      </div>
      <div className="t-detail">
        {estado === 'reposo' && 'El lector está activo y esperando'}
        {estado === 'resultado' && res?.detalle}
      </div>

      {estado === 'resultado' && (
        <div className="t-count">Vuelve al inicio en {count}s</div>
      )}

      <div className="t-actions">
        <button className="app-btn sm" onClick={marcar} disabled={estado === 'leyendo'}>
          {Icon.fingerprint({ width: 16, height: 16 })} Simular huella
        </button>
      </div>
    </div>
  )
}
