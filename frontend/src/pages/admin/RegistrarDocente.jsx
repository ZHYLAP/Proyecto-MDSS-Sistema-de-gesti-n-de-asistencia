import { useState } from 'react'
import { Icon } from '../../icons.jsx'
import { api } from '../../services/api.js'

export default function RegistrarDocente() {
  const [form, setForm] = useState({
    codigo: '',
    nombre: '',
    dni: '',
    departamento: '',
    correo: '',
    password: '',
  })
  const [huella, setHuella] = useState('pendiente') // pendiente | enrolando | ok
  const [guardado, setGuardado] = useState(false)
  const [mensaje, setMensaje] = useState('')
  const [cargando, setCargando] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const enrolar = () => {
    setHuella('enrolando')
    setTimeout(() => setHuella('ok'), 1600)
  }

  const guardar = async () => {
    if (!form.codigo || !form.nombre || !form.dni || !form.departamento || !form.correo) {
      setMensaje('Completa todos los campos antes de guardar.')
      setGuardado(false)
      return
    }

    if (!form.password) {
      setMensaje('Agrega un código/contraseña temporal para el docente.')
      setGuardado(false)
      return
    }

    if (huella !== 'ok' && huella !== 'pendiente') {
      setMensaje('La huella solo se usa como opción adicional; el registro puede continuar con código y contraseña.')
      setGuardado(false)
      return
    }

    setCargando(true)
    setMensaje('')

    try {
      const response = await api.post('/teachers', {
        ...form,
        huella: huella === 'ok',
      })

      if (response.data?.ok) {
        setGuardado(true)
        setMensaje('Docente registrado correctamente.')
      } else {
        setGuardado(false)
        setMensaje('No se pudo guardar el docente.')
      }
    } catch (error) {
      setGuardado(false)
      setMensaje('No se pudo conectar con el backend. Intenta más tarde.')
    } finally {
      setCargando(false)
    }
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
          <div className="app-field"><label>Código</label><input className="app-input" name="codigo" value={form.codigo} onChange={handleChange} placeholder="D-XXXX" /></div>
          <div className="app-field"><label>Nombres y apellidos</label><input className="app-input" name="nombre" value={form.nombre} onChange={handleChange} placeholder="Nombre completo" /></div>
          <div className="app-field"><label>DNI</label><input className="app-input" name="dni" value={form.dni} onChange={handleChange} placeholder="########" /></div>
          <div className="app-field">
            <label>Departamento académico</label>
            <input className="app-input" name="departamento" value={form.departamento} onChange={handleChange} placeholder="Ingeniería Informática" />
          </div>
          <div className="app-field"><label>Correo institucional</label><input className="app-input" name="correo" value={form.correo} onChange={handleChange} placeholder="nombre@unsaac.edu.pe" /></div>
          <div className="app-field"><label>Código / contraseña temporal</label><input className="app-input" name="password" value={form.password} onChange={handleChange} placeholder="Ej. docente123" /></div>
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
              {huella === 'pendiente' && 'Si no hay huella disponible, puedes usar el código y contraseña temporal.'}
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
          : <span className="muted">{mensaje || 'Completa los datos y agrega un código/contraseña temporal antes de guardar.'}</span>}
        <div className="spacer" />
        <button className="app-btn" onClick={guardar} disabled={cargando}>{cargando ? 'Guardando...' : 'Guardar docente'}</button>
      </div>
    </>
  )
}
