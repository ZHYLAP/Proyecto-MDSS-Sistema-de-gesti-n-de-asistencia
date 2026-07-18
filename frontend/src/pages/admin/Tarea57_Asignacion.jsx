import { useState } from 'react'
import { Icon } from '../../icons.jsx'
import { DOCENTES } from '../../data.js'

// Tarea 57 — Asignación de cursos por docente (patrón maestro-detalle). Regla: 1 a 5 cursos.
const MAX = 5

export default function Asignacion() {
  const [sel, setSel] = useState(DOCENTES[0])
  const [q, setQ] = useState('')
  const lista = DOCENTES.filter((d) => d.nombre.toLowerCase().includes(q.toLowerCase()))

  const carga = (n) => (n >= MAX ? 'bad' : n === 0 ? 'warn' : 'ok')
  const n = sel.cursos.length

  return (
    <>
      <div className="app-page-head">
        <h1>Asignación de cursos</h1>
        <p>Cada docente puede tener entre 1 y {MAX} cursos.</p>
      </div>

      <div className="app-grid" style={{ gridTemplateColumns: '300px 1fr' }}>
        <div className="app-card">
          <div className="app-field" style={{ marginBottom: 12 }}>
            <div className="row" style={{ border: '1px solid var(--linea)', borderRadius: 10, padding: '0 10px' }}>
              {Icon.search({ width: 16, height: 16 })}
              <input className="app-input" style={{ border: 'none', padding: '9px 6px' }} placeholder="Buscar docente" value={q} onChange={(e) => setQ(e.target.value)} />
            </div>
          </div>
          {lista.map((d) => (
            <button key={d.codigo} className="app-nav-item" style={{ justifyContent: 'space-between', background: sel.codigo === d.codigo ? 'var(--azul-claro)' : 'transparent' }} onClick={() => setSel(d)}>
              <span>{d.nombre}</span>
              <span className={`app-badge ${carga(d.cursos.length)}`}>{d.cursos.length}/{MAX}</span>
            </button>
          ))}
        </div>

        <div className="app-card">
          <h2>{sel.nombre} · {sel.categoria}</h2>
          <div className="app-grid cols-3" style={{ marginBottom: 16 }}>
            <div className="app-kpi"><div className="k-label">Cursos</div><div className="k-value">{n}<small>/{MAX}</small></div></div>
            <div className="app-kpi"><div className="k-label">Horas/semana</div><div className="k-value">{n * 2}</div></div>
            <div className="app-kpi"><div className="k-label">Aulas</div><div className="k-value">{new Set(sel.cursos.map((c) => c.aula)).size}</div></div>
          </div>
          <table className="app-table">
            <thead><tr><th>Código</th><th>Asignatura</th><th>Tipo</th><th>Día</th><th>Horario</th><th>Aula</th></tr></thead>
            <tbody>
              {sel.cursos.map((c, i) => (
                <tr key={i}>
                  <td>{c.codigo}</td><td>{c.nombre}</td><td>{c.tipo}</td><td>{c.dia}</td><td>{c.ini}–{c.fin}</td><td>{c.aula}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="row mt16">
            <span className="muted">Espacios disponibles: {Math.max(0, MAX - n)}</span>
            <div className="spacer" />
            <button className="app-btn" disabled={n >= MAX}>+ Asignar curso</button>
          </div>
        </div>
      </div>
    </>
  )
}
