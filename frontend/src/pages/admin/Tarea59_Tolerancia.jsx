import { useState } from 'react'
import { TOLERANCIA } from '../../data.js'

// Tarea 59 — Tolerancia de marcación.
// Entrada: −15 / +10 (pasado el +10 NO registra, sin tardanza). Salida: −10 / +15 (permisiva).
export default function Tolerancia() {
  const [t, setT] = useState(TOLERANCIA)
  const set = (k, v) => setT({ ...t, [k]: Number(v) })

  const excepciones = [
    { curso: 'IF-451 Metod. Desarrollo Software', antes: 15, despues: 10, personalizada: false },
    { curso: 'IF-512 Arquitectura de Software', antes: 20, despues: 5, personalizada: true },
  ]

  return (
    <>
      <div className="app-page-head">
        <h1>Tolerancia de marcación</h1>
        <p>Ventanas de apertura y cierre del lector para entrada y salida de cursos.</p>
      </div>

      <div className="app-grid cols-2">
        <div className="app-card">
          <h2>Entrada al curso</h2>
          <div className="app-grid cols-2">
            <div className="app-field"><label>Minutos antes (abre lector)</label><input className="app-input" type="number" value={t.entradaAntes} onChange={(e) => set('entradaAntes', e.target.value)} /></div>
            <div className="app-field"><label>Minutos después (cierra)</label><input className="app-input" type="number" value={t.entradaDespues} onChange={(e) => set('entradaDespues', e.target.value)} /></div>
          </div>
          <div className="app-badge warn" style={{ display: 'inline-block' }}>Pasados los {t.entradaDespues} min, el sistema no registra (sin tardanza).</div>
        </div>

        <div className="app-card">
          <h2>Salida del curso</h2>
          <div className="app-grid cols-2">
            <div className="app-field"><label>Minutos antes</label><input className="app-input" type="number" value={t.salidaAntes} onChange={(e) => set('salidaAntes', e.target.value)} /></div>
            <div className="app-field"><label>Minutos después</label><input className="app-input" type="number" value={t.salidaDespues} onChange={(e) => set('salidaDespues', e.target.value)} /></div>
          </div>
          <div className="app-badge ok" style={{ display: 'inline-block' }}>Salida permisiva: no es obligatoria dentro de la ventana.</div>
        </div>
      </div>

      <div className="app-card mt24">
        <div className="row" style={{ marginBottom: 12 }}>
          <h2 style={{ margin: 0 }}>Excepciones por curso</h2>
          <div className="spacer" />
          <span className="muted">{excepciones.filter((e) => e.personalizada).length} con configuración propia</span>
        </div>
        <table className="app-table">
          <thead><tr><th>Curso</th><th>Antes (min)</th><th>Después (min)</th><th>Estado</th></tr></thead>
          <tbody>
            {excepciones.map((e, i) => (
              <tr key={i}>
                <td>{e.curso}</td><td>{e.antes}</td><td>{e.despues}</td>
                <td><span className={`app-badge ${e.personalizada ? 'warn' : 'ok'}`}>{e.personalizada ? 'Personalizada' : 'Global'}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="row end mt24"><button className="app-btn">Guardar tolerancia</button></div>
    </>
  )
}
