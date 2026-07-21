import { useState } from 'react'
import { Icon } from '../../icons.jsx'
import { REPORTE_FILAS } from '../../data.js'

// Tarea 75 — Reportería. Filtros + exportación PDF / Excel / CSV.
export default function Reporteria() {
  const [tipo, setTipo] = useState('todos')
  const [aviso, setAviso] = useState('')

  const filas = REPORTE_FILAS.filter((r) =>
    tipo === 'todos' ? true : tipo === 'inst' ? r.tipo === 'Institucional' : r.tipo === 'Curso'
  )

  const exportar = (fmt) => {
    setAviso(`Generando reporte en ${fmt}… (demo)`)
    setTimeout(() => setAviso(''), 2500)
  }

  return (
    <>
      <div className="app-page-head">
        <h1>Reportería</h1>
        <p>Consulta y exporta el registro de asistencia.</p>
      </div>

      <div className="app-card">
        <div className="row wrap" style={{ gap: 12 }}>
          <div className="app-field" style={{ margin: 0 }}>
            <label>Desde</label><input className="app-input" type="date" defaultValue="2026-07-11" />
          </div>
          <div className="app-field" style={{ margin: 0 }}>
            <label>Hasta</label><input className="app-input" type="date" defaultValue="2026-07-15" />
          </div>
          <div className="app-field" style={{ margin: 0 }}>
            <label>Tipo</label>
            <select className="app-input" value={tipo} onChange={(e) => setTipo(e.target.value)}>
              <option value="todos">Todos</option>
              <option value="inst">Institucional</option>
              <option value="curso">Curso</option>
            </select>
          </div>
          <div className="spacer" />
          <div className="app-field" style={{ margin: 0, alignSelf: 'flex-end' }}>
            <div className="row">
              <button className="app-btn ghost sm" onClick={() => exportar('PDF')}>{Icon.download({ width: 15, height: 15 })} PDF</button>
              <button className="app-btn ghost sm" onClick={() => exportar('Excel')}>{Icon.download({ width: 15, height: 15 })} Excel</button>
              <button className="app-btn ghost sm" onClick={() => exportar('CSV')}>{Icon.download({ width: 15, height: 15 })} CSV</button>
            </div>
          </div>
        </div>
        {aviso && <div className="app-badge ok mt16" style={{ display: 'inline-block' }}>{aviso}</div>}
      </div>

      <div className="app-card mt24">
        <table className="app-table">
          <thead><tr><th>Fecha</th><th>Docente</th><th>Curso</th><th>Tipo</th><th>Hora</th><th>Estado</th></tr></thead>
          <tbody>
            {filas.map((r, i) => (
              <tr key={i}>
                <td>{r.fecha}</td><td>{r.docente}</td><td>{r.curso}</td><td>{r.tipo}</td><td>{r.hora}</td>
                <td><span className={`app-badge ${r.estado === 'Registrado' ? 'ok' : 'bad'}`}>{r.estado}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
