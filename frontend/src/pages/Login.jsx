import { useState, useRef, useEffect } from 'react'
import { Icon } from '../icons.jsx'
import SensorPanel from './shared/SensorPanel.jsx'
import EstacionCentral from './shared/EstacionCentral.jsx'
import logoEpiis from '../assets/logo-epiis.png'
import logoUnsaac from '../assets/logo-unsaac.png'
import { CREDENCIALES } from '../data.js'

export default function Login({ onLogin }) {
  const [codigo, setCodigo] = useState('')
  const [pass, setPass] = useState('')
  const [error, setError] = useState('')

  // Flujo del sensor (marcación por huella, independiente del login)
  const [estado, setEstado] = useState('idle')       // idle | leyendo
  const [escenario, setEscenario] = useState(null)   // escenario a mostrar a pantalla completa
  const timer = useRef(null)
  useEffect(() => () => clearTimeout(timer.current), [])

  const entrar = () => {
    const cred = CREDENCIALES[codigo.trim()]
    if (cred && cred.pass === pass) {
      setError('')
      onLogin({ role: cred.role, nombre: cred.nombre, codigo: cred.codigo })
    } else {
      setError('Código o contraseña incorrectos.')
    }
  }

  // Simular lectura de huella: el sensor "lee" ~1.6s y luego abre la pantalla completa
  const simular = (esc) => {
    if (estado === 'leyendo') return
    setEstado('leyendo')
    timer.current = setTimeout(() => {
      setEstado('idle')
      setEscenario(esc)
    }, 1600)
  }

  return (
    <div className="login2">
      <div className="login2-card">
        <div className="login2-brand">
          <img src={logoEpiis} alt="EPIIS" />
          <img src={logoUnsaac} alt="UNSAAC" />
        </div>
        <h1>Iniciar sesión</h1>
        <p className="login2-sub">Sistema de Control de Asistencia Docente</p>

        <div className="app-field">
          <label>Código de docente / usuario</label>
          <input className="app-input" value={codigo} placeholder="Ingrese su código"
            onChange={(e) => setCodigo(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && entrar()} />
        </div>
        <div className="app-field">
          <label>Contraseña</label>
          <input className="app-input" type="password" value={pass} placeholder="••••••••"
            onChange={(e) => setPass(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && entrar()} />
        </div>

        {error && <div className="app-badge bad" style={{ display: 'inline-block', marginBottom: 12 }}>{error}</div>}

        <button className="app-btn login2-submit" onClick={entrar}>Ingresar</button>

        <div className="login2-hint">
          <span className="row" style={{ gap: 6 }}>{Icon.fingerprint({ width: 15, height: 15 })} ¿Solo vas a marcar? Usa la estación de al lado →</span>
          <div className="mt8">
            Demo — Administrador: <code>admin</code> / <code>admin123</code><br />
            Demo — Docente: <code>D-1001</code> / <code>docente123</code>
          </div>
        </div>
      </div>

      <SensorPanel estado={estado} onSimular={simular} />

      {escenario && (
        <EstacionCentral escenario={escenario} duracion={12} onClose={() => setEscenario(null)} />
      )}
    </div>
  )
}
