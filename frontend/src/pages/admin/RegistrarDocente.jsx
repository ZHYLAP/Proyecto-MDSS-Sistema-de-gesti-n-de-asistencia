import { useState } from 'react'
import { Icon } from '../../icons.jsx'

export default function RegistrarDocente() {
  const [huella, setHuella] = useState('pendiente') // pendiente | enrolando | ok
  const [guardado, setGuardado] = useState(false)

  const enrolar = () => {
    setHuella('enrolando')
    setTimeout(() => setHuella('ok'), 1600)
  }

  return (
    <>
      <div className="app-page-head">
        <h1>Registrar docente</h1>
        <p>Datos personales, departamento y enrolamiento de huella.</p>
      </div>

      <div className="app-grid cols-2">
        <div className="app-card">
          <h2>Datos del docente</h2>
          <div className="app-field"><label>Código</label><input className="app-input" placeholder="D-XXXX" /></div>
          <div className="app-field"><label>Nombres y apellidos</label><input className="app-input" placeholder="Nombre completo" /></div>
          <div className="app-field"><label>DNI</label><input className="app-input" placeholder="########" /></div>
          <div className="app-field">
            <label>Departamento académico</label>
            <input className="app-input" placeholder="Ingeniería Informática" />
          </div>
          <div className="app-field"><label>Correo institucional</label><input className="app-input" placeholder="nombre@unsaac.edu.pe" /></div>
        </div>

        <div className="app-card" style={{ textAlign: 'center' }}>
          <h2>Enrolamiento de huella</h2>
          <div className={`totem ${huella === 'enrolando' ? 'is-leyendo' : huella === 'ok' ? 'is-ok' : ''}`} style={{ boxShadow: 'none', width: '100%', padding: '10px 0 0' }}>
            <div className="t-disc" style={{ width: 140, height: 140 }}>
              {huella === 'ok' ? Icon.check({}) : Icon.fingerprint({})}
            </div>
            <div className="t-msg" style={{ fontSize: 15 }}>
              {huella === 'pendiente' && 'Huella pendiente'}
              {huella === 'enrolando' && 'Capturando…'}
              {huella === 'ok' && 'Huella enrolada'}
            </div>
            <div className="t-detail">
              {huella === 'pendiente' && 'El docente debe colocar el dedo 3 veces.'}
              {huella === 'ok' && 'Plantilla biométrica guardada correctamente.'}
            </div>
          </div>
          <button className="app-btn mt16" onClick={enrolar} disabled={huella === 'enrolando'}>
            {Icon.fingerprint({ width: 16, height: 16 })} {huella === 'ok' ? 'Volver a capturar' : 'Capturar huella'}
          </button>
        </div>
      </div>

      <div className="app-card mt24 row">
        {guardado
          ? <span className="app-badge ok">Docente registrado correctamente</span>
          : <span className="muted">Completa los datos y enrola la huella antes de guardar.</span>}
        <div className="spacer" />
        <button className="app-btn" onClick={() => setGuardado(true)}>Guardar docente</button>
      </div>
    </>
  )
}
