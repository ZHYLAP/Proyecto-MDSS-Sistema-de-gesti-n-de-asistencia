import { useState, useEffect } from 'react'
import { Icon } from '../../icons.jsx'
import { getDocente } from '../../data.js'

// Tarea 61 — Estación Central de Marcación (pantalla completa).
// Recibe un escenario y muestra: datos del docente, mensajes de registro y
// la tabla de cursos con el curso detectado resaltado. Se cierra sola.
const ICON_MSG = { ok: 'check', info: 'clock', warn: 'alert', bad: 'x' }

function iniciales(nombre) {
  const p = nombre.trim().split(/\s+/)
  return ((p[0]?.[0] || '') + (p[1]?.[0] || '')).toUpperCase()
}

export default function EstacionCentral({ escenario, duracion = 12, onClose }) {
  const [count, setCount] = useState(duracion)
  const docente = escenario.docente ? getDocente(escenario.docente) : null

  useEffect(() => {
    let n = duracion
    const iv = setInterval(() => {
      n -= 1
      setCount(n)
      if (n <= 0) { clearInterval(iv); onClose() }
    }, 1000)
    return () => clearInterval(iv)
  }, [duracion, onClose])

  const tono = escenario.tone // ok | warn | bad
  const cerco = tono === 'ok' ? 'var(--ok)' : tono === 'warn' ? 'var(--ambar)' : 'var(--rojo)'

  return (
    <div className="estacion-overlay">
      <div className="estacion" style={{ borderTop: `6px solid ${cerco}` }}>
        <div className="e-bar">
          <div className="e-uni">UNIVERSIDAD NACIONAL DE SAN ANTONIO ABAD DEL CUSCO</div>
          <div className="e-fecha">Escuela Profesional de Ingeniería Informática y de Sistemas · {escenario.hora} a.m.</div>
        </div>

        {docente ? (
          <div className="e-body">
            <div className="e-doc">
              <div className="e-avatar">{iniciales(docente.nombre)}</div>
              <div className="e-name">{docente.nombre}</div>
              <div className="e-code">{docente.codigo} · {docente.categoria}</div>
              <div className="e-dpto">{docente.dpto}</div>
            </div>
            <div className="e-main">
              <div className="e-msgs">
                {escenario.mensajes.map((m, i) => (
                  <div key={i} className={`e-msg ${m.t}`}>
                    <span className="e-msg-ic">{Icon[ICON_MSG[m.t]]({ width: 20, height: 20 })}</span>
                    <span>
                      <b>{m.txt}</b>
                      {m.sub && <span className="e-msg-sub">{m.sub}</span>}
                    </span>
                  </div>
                ))}
              </div>
              <table>
                <thead>
                  <tr><th>CÓDIGO</th><th>ASIGNATURA</th><th>DÍA</th><th>HORARIO</th><th>AULA</th></tr>
                </thead>
                <tbody>
                  {docente.cursos.map((c, i) => {
                    const hi = escenario.detectado && c.codigo === escenario.detectado
                    return (
                      <tr key={i} className={hi ? 'hi' : escenario.detectado ? 'dim' : ''}>
                        <td>{c.codigo}</td>
                        <td>{c.nombre}</td>
                        <td>{c.dia}</td>
                        <td>{c.ini}–{c.fin}</td>
                        <td>{c.aula}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
              {escenario.detectado && (
                <div className="e-detected">{Icon.clock({ width: 16, height: 16 })} Curso detectado según horario · resaltado arriba</div>
              )}
            </div>
          </div>
        ) : (
          // Huella no reconocida: sin datos de docente
          <div className="e-error">
            <div className="e-error-ic">{Icon.x({ width: 54, height: 54 })}</div>
            <div className="e-error-msg">{escenario.mensajes[0].txt}</div>
            <div className="e-error-sub">{escenario.mensajes[0].sub}</div>
          </div>
        )}

        <div className="e-foot">
          <span className="e-count">Vuelve al inicio en {count}s</span>
          <button className="app-btn ghost sm" onClick={onClose}>Cerrar ahora</button>
        </div>
      </div>
    </div>
  )
}
