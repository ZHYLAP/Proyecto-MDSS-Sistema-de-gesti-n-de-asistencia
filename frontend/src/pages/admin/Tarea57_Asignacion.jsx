import { useState, useEffect } from 'react'
import { Icon } from '../../icons.jsx'
import { DOCENTES } from '../../data.js'
import { api } from '../../services/api.js'

// Tarea 57 — Asignación de cursos por docente (patrón maestro-detalle). Regla: 1 a 5 cursos.
const MAX = 5

export default function Asignacion() {
  const [docentes, setDocentes] = useState(DOCENTES)
  const [sel, setSel] = useState(docentes[0])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let mounted = true
    const load = async () => {
      setLoading(true)
      try {
        const r = await api.get('/teachers')
        if (!mounted) return
        if (r.data?.ok && r.data.teachers) {
          // normalize shape to match DOCENTES if needed
          const normalized = r.data.teachers.map((t) => ({ codigo: t.id || t.codigo, nombre: t.name || t.nombre || t.email, categoria: t.role || 'profesor', dpto: '-', huella: false, cursos: [] }))
          setDocentes(normalized)
          setSel(normalized[0])
        }
      } catch (e) {
        // ignore, keep DOCENTES fallback
      } finally { setLoading(false) }
    }
    load()
    return () => { mounted = false }
  }, [])
  const [q, setQ] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ codigo: '', nombre: '', tipo: 'T', dia: '', ini: '', fin: '', aula: '' })
  const lista = docentes.filter((d) => d.nombre.toLowerCase().includes(q.toLowerCase()))

  const carga = (n) => (n >= MAX ? 'bad' : n === 0 ? 'warn' : 'ok')
  const n = sel ? sel.cursos.length : 0

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
            <button key={d.codigo} className="app-nav-item" style={{ justifyContent: 'space-between', background: (sel && sel.codigo) === d.codigo ? 'var(--azul-claro)' : 'transparent' }} onClick={() => setSel(d)}>
              <span>{d.nombre}</span>
              <span className={`app-badge ${carga((d.cursos || []).length)}`}>{(d.cursos || []).length}/{MAX}</span>
            </button>
          ))}
        </div>

        <div className="app-card">
          <h2>{sel ? `${sel.nombre} · ${sel.categoria}` : '—'}</h2>
          <div className="app-grid cols-3" style={{ marginBottom: 16 }}>
            <div className="app-kpi"><div className="k-label">Cursos</div><div className="k-value">{n}<small>/{MAX}</small></div></div>
            <div className="app-kpi"><div className="k-label">Horas/semana</div><div className="k-value">{n * 2}</div></div>
            <div className="app-kpi"><div className="k-label">Aulas</div><div className="k-value">{new Set((sel && sel.cursos ? sel.cursos.map((c) => c.aula) : [])).size}</div></div>
          </div>
          <table className="app-table">
            <thead><tr><th>Código</th><th>Asignatura</th><th>Tipo</th><th>Día</th><th>Horario</th><th>Aula</th></tr></thead>
            <tbody>
              {(sel && sel.cursos ? sel.cursos : []).map((c, i) => (
                <tr key={i}>
                  <td>{c.codigo}</td><td>{c.nombre}</td><td>{c.tipo}</td><td>{c.dia}</td><td>{c.ini}–{c.fin}</td><td>{c.aula}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="row mt16">
            <span className="muted">Espacios disponibles: {Math.max(0, MAX - n)}</span>
            <div className="spacer" />
            <button className="app-btn" disabled={n >= MAX} onClick={() => { setShowForm(true); setForm({ codigo: '', nombre: '', tipo: 'T', dia: '', ini: '', fin: '', aula: '' }) }}>+ Asignar curso</button>
          </div>

          {showForm && (
            <div style={{ marginTop: 12, padding: 12, border: '1px dashed var(--linea)', borderRadius: 8 }}>
              <div className="row" style={{ gap: 8 }}>
                <input placeholder="Código" value={form.codigo} onChange={(e) => setForm({ ...form, codigo: e.target.value })} />
                <input placeholder="Nombre" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} />
                <select value={form.tipo} onChange={(e) => setForm({ ...form, tipo: e.target.value })}><option value="T">T</option><option value="P">P</option></select>
                <input placeholder="Día" value={form.dia} onChange={(e) => setForm({ ...form, dia: e.target.value })} />
                <input placeholder="Inicio" value={form.ini} onChange={(e) => setForm({ ...form, ini: e.target.value })} />
                <input placeholder="Fin" value={form.fin} onChange={(e) => setForm({ ...form, fin: e.target.value })} />
                <input placeholder="Aula" value={form.aula} onChange={(e) => setForm({ ...form, aula: e.target.value })} />
              </div>
              <div className="row" style={{ marginTop: 8 }}>
                <div className="spacer" />
                <button className="app-btn" onClick={async () => {
                  // simple validation
                  if (!form.codigo || !form.nombre) return alert('Código y nombre requeridos')
                  // update docentes state
                  setDocentes((prev) => {
                    const updated = prev.map((d) => {
                      if (d.codigo === sel.codigo) {
                        return { ...d, cursos: [...d.cursos, { ...form }] }
                      }
                      return d
                    })
                    const newSel = updated.find((x) => x.codigo === sel.codigo)
                    setSel(newSel)
                    return updated
                  })
                  setShowForm(false)
                }}>Asignar</button>
                <button className="app-btn ghost" onClick={() => setShowForm(false)}>Cancelar</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
