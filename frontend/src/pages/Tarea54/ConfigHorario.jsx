import './ConfigHorario.css'
import logoEpiis from '../../assets/logo-epiis.png'
import logoUnsaac from '../../assets/logo-unsaac.png'

// Tarea 54 - Configuración del horario institucional
// Diseño: Dominic Flores (UX/UI)
export default function ConfigHorario() {
  const dias = [
    { l: 'L', active: true }, { l: 'M', active: true }, { l: 'X', active: true },
    { l: 'J', active: true }, { l: 'V', active: true },
    { l: 'S', active: false }, { l: 'D', active: false }
  ]

  const feriados = [
    '28 de julio - Fiestas Patrias',
    '29 de julio - Fiestas Patrias',
    '30 de agosto - Sta. Rosa de Lima'
  ]

  const historial = [
    { fecha: '22 may 2025', usuario: 'admin@unsaac.edu.pe', cambio: <>Hora límite: <strong>08:30 a.m. → 08:00 a.m.</strong></> },
    { fecha: '12 may 2025', usuario: 'admin@unsaac.edu.pe', cambio: 'Agregada excepción: 28 de julio' },
    { fecha: '26 abr 2025', usuario: 'admin@unsaac.edu.pe', cambio: 'Días hábiles: L - S → L - V' }
  ]

  return (
    <div className="ch-page">
      <div className="ch-watermark"></div>

      {/* BARRA SUPERIOR INSTITUCIONAL */}
      <header className="ch-top">
        <div className="ch-brand">
          <img src={logoEpiis} alt="Logo EPIIS" />
          <div className="ch-brand-text">INGENIERÍA<br />INFORMÁTICA Y DE<br />SISTEMAS</div>
        </div>
        <div className="ch-brand-divider"></div>
        <div className="ch-brand">
          <img src={logoUnsaac} alt="Logo UNSAAC" />
          <div className="ch-brand-text">UNSAAC<br /><span className="sub">Universidad Nacional de<br />San Antonio Abad del Cusco</span></div>
        </div>
      </header>

      <div className="ch-layout">
        {/* SIDEBAR */}
        <aside className="ch-sidebar">
          <div className="ch-sidebar-title">ADMINISTRADOR</div>
          <div className="ch-nav-item"><span className="ch-icon ch-ico-dashboard"></span><span>Inicio</span></div>
          <div className="ch-nav-item"><span className="ch-icon ch-ico-users"></span><span>Docentes</span></div>
          <div className="ch-nav-item active"><span className="ch-icon ch-ico-clock"></span><span>Horarios</span></div>
          <div className="ch-nav-item"><span className="ch-icon ch-ico-file"></span><span>Reportes</span></div>
          <div className="ch-nav-item"><span className="ch-icon ch-ico-shield"></span><span>Seguridad</span></div>
        </aside>

        {/* MAIN */}
        <main className="ch-main">
          <div className="ch-main-header">
            <div>
              <div className="ch-main-title">Configuración del horario institucional</div>
              <div className="ch-main-subtitle">Define los días y la hora límite de ingreso para todos los docentes</div>
            </div>
            <button className="ch-btn-primary"><span className="ch-ico-save"></span> Guardar cambios</button>
          </div>

          {/* CARD 1: DIAS HABILES */}
          <section className="ch-card">
            <div className="ch-card-title">Días hábiles</div>
            <div className="ch-card-subtitle">Selecciona los días en que se exige marcación biométrica de ingreso</div>
            <div className="ch-days-row">
              {dias.map((d, i) => (
                <button key={i} className={`ch-day-btn ${d.active ? 'active' : 'inactive'}`}>{d.l}</button>
              ))}
            </div>
            <div className="ch-card-footer-text">Lunes a viernes, según calendario académico UNSAAC</div>
          </section>

          {/* CARD 2: HORA MAXIMA */}
          <section className="ch-card">
            <div className="ch-card-title">Hora máxima de ingreso institucional</div>
            <div className="ch-card-subtitle">Pasada esta hora, el registro se considerará como tardanza institucional</div>
            <div className="ch-time-row">
              <div className="ch-time-input"><span className="ch-ico-time"></span>08:00 a.m.</div>
              <div className="ch-info-box">
                <span className="ch-ico-info"></span>
                <span>Los docentes deben registrar su ingreso biométrico antes de esta hora en cualquier día hábil.</span>
              </div>
            </div>
          </section>

          {/* CARD 3: VISTA PREVIA */}
          <section className="ch-card">
            <div className="ch-card-title">Vista previa de la regla</div>
            <div className="ch-card-subtitle">Así quedará configurada la ventana de marcación institucional</div>
            <div className="ch-tl-container">
              <div className="ch-tl-bar">
                <div className="ch-tl-green"><span className="ch-tl-check"></span> Ingreso a tiempo</div>
                <div className="ch-tl-amber"><span className="ch-tl-clock"></span> Tardanza institucional</div>
                <div className="ch-tl-divider"></div>
                <div className="ch-tl-pill">08:00</div>
              </div>
              <div className="ch-tl-labels">
                <span>07:00</span><span>08:00</span><span>09:00</span><span>10:00</span><span>11:00</span>
              </div>
            </div>
          </section>

          {/* CARD 4: EXCEPCIONES */}
          <section className="ch-card">
            <div className="ch-card-header-row">
              <div>
                <div className="ch-card-title">Excepciones y feriados</div>
                <div className="ch-card-subtitle" style={{ marginBottom: 0 }}>Días en que no se exige marcación biométrica</div>
              </div>
              <button className="ch-btn-outline">+ Agregar fecha</button>
            </div>
            <div className="ch-chips-row">
              {feriados.map((f, i) => (
                <div key={i} className="ch-chip">{f} <span className="ch-x"></span></div>
              ))}
            </div>
          </section>

          {/* CARD 5: HISTORIAL */}
          <section className="ch-card">
            <div className="ch-card-title">Historial de cambios</div>
            <div className="ch-card-subtitle">Últimas modificaciones a esta configuración</div>
            <table className="ch-table">
              <thead>
                <tr><th style={{ width: 140 }}>Fecha</th><th style={{ width: 200 }}>Usuario</th><th>Cambio</th></tr>
              </thead>
              <tbody>
                {historial.map((h, i) => (
                  <tr key={i}>
                    <td style={{ color: '#5f5e5a' }}>{h.fecha}</td>
                    <td>{h.usuario}</td>
                    <td>{h.cambio}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          {/* FOOTER */}
          <div className="ch-footer-actions">
            <div className="ch-footer-text">Última actualización: hace 2 días por admin@unsaac.edu.pe</div>
            <div className="ch-footer-buttons">
              <button className="ch-btn-secondary">Cancelar</button>
              <button className="ch-btn-primary">Guardar cambios</button>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
