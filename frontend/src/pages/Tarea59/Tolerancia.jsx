import './Tolerancia.css'
import logoEpiis from '../../assets/logo-epiis.png'
import logoUnsaac from '../../assets/logo-unsaac.png'
import fondoCampus from '../../assets/fondo-campus.jpg'

// Tarea 59 - Tolerancia de marcación por curso (15/10 min con override por curso)
// Diseño: Dominic Flores (UX/UI)
export default function Tolerancia() {

  const excepciones = [
    { curso: 'Algoritmos', codigo: 'IF-204 · Dr. Quispe', aula: 'A-304 · Pabellón A', antes: '20 min', despues: '10 min' },
    { curso: 'Bases de Datos', codigo: 'IF-301 · Dra. Huamán', aula: 'B-201 · Pabellón B', antes: '15 min', despues: '15 min' },
    { curso: 'Laboratorio de Redes', codigo: 'IF-402 · Dr. Mamani', aula: 'Lab. 3 · Pabellón C', antes: '10 min', despues: '5 min' }
  ]

  const historial = [
    { fecha: '25 may 2026', usuario: 'admin@unsaac.edu.pe', cambio: 'Excepción agregada: Algoritmos (20/10 min)' },
    { fecha: '18 may 2026', usuario: 'admin@unsaac.edu.pe', cambio: <>Tolerancia global: <strong>10/10 min → 15/10 min</strong></> },
    { fecha: '05 may 2026', usuario: 'admin@unsaac.edu.pe', cambio: 'Configuración inicial: 10 min antes / 10 min después' }
  ]

  return (
    <div className="tl-page">
      <div className="tl-watermark" style={{ backgroundImage: `url(${fondoCampus})` }}></div>

      {/* BARRA SUPERIOR INSTITUCIONAL */}
      <header className="tl-top">
        <div className="tl-brand">
          <img src={logoEpiis} alt="Logo EPIIS" />
          <div className="tl-brand-text">INGENIERÍA<br />INFORMÁTICA Y DE<br />SISTEMAS</div>
        </div>
        <div className="tl-brand-divider"></div>
        <div className="tl-brand">
          <img src={logoUnsaac} alt="Logo UNSAAC" />
          <div className="tl-brand-text">UNSAAC<br /><span className="sub">Universidad Nacional de<br />San Antonio Abad del Cusco</span></div>
        </div>
      </header>

      <div className="tl-layout">
        {/* SIDEBAR con submenú expandido */}
        <aside className="tl-sidebar">
          <div className="tl-sidebar-title">ADMINISTRADOR</div>
          <div className="tl-nav-item"><span className="tl-icon tl-ico-dashboard"></span><span>Inicio</span></div>
          <div className="tl-nav-item"><span className="tl-icon tl-ico-users"></span><span>Docentes</span></div>
          <div className="tl-nav-item active"><span className="tl-icon tl-ico-clock"></span><span>Horarios</span></div>
          <div className="tl-nav-subitem">Configuración general</div>
          <div className="tl-nav-subitem active">Tolerancia de marcación</div>
          <div className="tl-nav-subitem">Asignación de cursos</div>
          <div className="tl-nav-item"><span className="tl-icon tl-ico-file"></span><span>Reportes</span></div>
          <div className="tl-nav-item"><span className="tl-icon tl-ico-shield"></span><span>Seguridad</span></div>
        </aside>

        {/* MAIN */}
        <main className="tl-main">
          <div className="tl-main-header">
            <div>
              <div className="tl-main-title">Tolerancia de marcación por curso</div>
              <div className="tl-main-subtitle">Define los márgenes de tiempo válidos para el registro de asistencia a cada curso</div>
            </div>
            <button className="tl-btn-primary"><span className="tl-ico-save"></span> Guardar cambios</button>
          </div>

          {/* CARD 1: TOLERANCIA GLOBAL */}
          <section className="tl-card">
            <div className="tl-card-title">Tolerancia global por defecto</div>
            <div className="tl-card-subtitle">Esta configuración se aplica a todos los cursos del sistema, salvo aquellos con tolerancia personalizada</div>

            <div className="tl-tol-inputs">
              <div className="tl-tol-block before">
                <div className="tl-tol-label">MINUTOS ANTES DEL INICIO</div>
                <div className="tl-tol-row">
                  <input type="text" defaultValue="15" className="tl-tol-input" />
                  <span className="tl-tol-unit">minutos</span>
                </div>
                <div className="tl-tol-help">Apertura anticipada del lector biométrico</div>
              </div>
              <div className="tl-tol-block after">
                <div className="tl-tol-label">MINUTOS DESPUÉS DEL INICIO</div>
                <div className="tl-tol-row">
                  <input type="text" defaultValue="10" className="tl-tol-input" />
                  <span className="tl-tol-unit">minutos</span>
                </div>
                <div className="tl-tol-help">Cierre del lector tras iniciado el curso</div>
              </div>
            </div>

            <div className="tl-preview-section">
              <div className="tl-preview-label">VISTA PREVIA DE LA VENTANA</div>
              <div className="tl-timeline-bar">
                <div className="tl-tl-window">Ventana válida de marcación</div>
                <div className="tl-tl-divider start"></div>
                <div className="tl-tl-divider end"></div>
              </div>
              <div className="tl-tl-labels">
                <span>−20 min</span>
                <span>−10 min</span>
                <span>Inicio</span>
                <span>+10 min</span>
                <span>+20 min</span>
              </div>
            </div>
          </section>

          {/* CARD 2: EJEMPLO */}
          <section className="tl-card">
            <div className="tl-card-title">Ejemplo de aplicación</div>
            <div className="tl-card-subtitle">Cómo se aplica la tolerancia global a un curso programado</div>
            <div className="tl-example-box">
              <span className="tl-ico-info-blue"></span>
              <div className="tl-example-content">
                <div className="tl-example-title">Curso de las 08:00 a.m.</div>
                <div className="tl-example-text">
                  Con la configuración actual, el lector biométrico estará habilitado para registrar asistencia desde las <strong>07:45 a.m.</strong> (15 min antes) hasta las <strong>08:10 a.m.</strong> (10 min después). Cualquier marcación dentro de esta ventana se registra como asistencia a tiempo. Marcaciones fuera de este rango se contabilizan como tardanza o falta según el caso.
                </div>
              </div>
            </div>
          </section>

          {/* CARD 3: EXCEPCIONES */}
          <section className="tl-card">
            <div className="tl-card-header-row">
              <div>
                <div className="tl-card-title">Excepciones por curso</div>
                <div className="tl-card-subtitle" style={{ marginBottom: 0 }}>Cursos con tolerancia distinta a la global. Los demás cursos usan los valores por defecto</div>
              </div>
              <button className="tl-btn-outline">+ Agregar excepción</button>
            </div>
            <table className="tl-table">
              <thead>
                <tr>
                  <th>CURSO</th>
                  <th>AULA · PABELLÓN</th>
                  <th>ANTES</th>
                  <th>DESPUÉS</th>
                  <th>ESTADO</th>
                  <th style={{ textAlign: 'right' }}>ACCIONES</th>
                </tr>
              </thead>
              <tbody>
                {excepciones.map((e, i) => (
                  <tr key={i}>
                    <td><strong>{e.curso}</strong><br /><span className="tl-td-sub">{e.codigo}</span></td>
                    <td>{e.aula}</td>
                    <td>{e.antes}</td>
                    <td>{e.despues}</td>
                    <td><span className="tl-badge-custom">Personalizada</span></td>
                    <td style={{ textAlign: 'right' }}>
                      <button className="tl-btn-edit">Editar</button>
                      <button className="tl-btn-delete">Quitar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="tl-card-footer-text">3 cursos con tolerancia personalizada · 47 cursos usan la configuración global</div>
          </section>

          {/* CARD 4: HISTORIAL */}
          <section className="tl-card">
            <div className="tl-card-title">Historial de cambios</div>
            <div className="tl-card-subtitle">Últimas modificaciones a la configuración de tolerancia</div>
            <table className="tl-table tl-table-history">
              <thead>
                <tr><th style={{ width: 140 }}>Fecha</th><th style={{ width: 220 }}>Usuario</th><th>Cambio</th></tr>
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
          <div className="tl-footer-actions">
            <div className="tl-footer-text">Última actualización: hace 1 día por admin@unsaac.edu.pe</div>
            <div className="tl-footer-buttons">
              <button className="tl-btn-secondary">Cancelar</button>
              <button className="tl-btn-primary">Guardar cambios</button>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
