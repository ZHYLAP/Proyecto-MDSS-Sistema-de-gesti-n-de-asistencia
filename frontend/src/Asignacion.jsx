import './Asignacion.css'
import logoEpiis from '../../assets/logo-epiis.png'
import logoUnsaac from '../../assets/logo-unsaac.png'
import fondoCampus from '../../assets/fondo-campus.jpg'

// Tarea 57 - Asignación de cursos por docente (1 a 5 cursos)
// Diseño: Dominic Flores (UX/UI)
export default function Asignacion() {

  const docentes = [
    { iniciales: 'EQ', color: '#185fa5', nombre: 'Dr. Efraín Quispe', meta: 'Informática · D-1842', count: '4/5', tipo: 'partial', selected: true },
    { iniciales: 'MH', color: '#0f6e56', nombre: 'Dra. Maricielo Huamán', meta: 'Sistemas · D-1903', count: '5/5', tipo: 'full' },
    { iniciales: 'JM', color: '#854f0b', nombre: 'Dr. Jeliel Mamani', meta: 'Informática · D-1721', count: '3/5', tipo: 'partial' },
    { iniciales: 'DF', color: '#a32d2d', nombre: 'Mg. Dominic Flores', meta: 'Sistemas · D-2014', count: '2/5', tipo: 'partial' },
    { iniciales: 'RV', color: '#5f5e5a', nombre: 'Dr. Raúl Vargas', meta: 'Informática · D-1655', count: '0/5', tipo: 'empty' },
    { iniciales: 'AC', color: '#185fa5', nombre: 'Mg. Ana Choque', meta: 'Sistemas · D-1988', count: '4/5', tipo: 'partial' },
    { iniciales: 'PT', color: '#0f6e56', nombre: 'Dr. Pablo Tito', meta: 'Informática · D-1490', count: '5/5', tipo: 'full' }
  ]

  const cursos = [
    { nombre: 'Algoritmos', codigo: 'IF-204', aula: 'A-304 · Pabellón A', dias: ['L', 'X'], horario: '08:00 – 10:00' },
    { nombre: 'Bases de Datos', codigo: 'IF-301', aula: 'B-201 · Pabellón B', dias: ['M', 'J'], horario: '11:00 – 13:00' },
    { nombre: 'Compiladores', codigo: 'IF-405', aula: 'A-110 · Pabellón A', dias: ['L', 'J'], horario: '14:00 – 16:00' },
    { nombre: 'Redes de Computadoras', codigo: 'IF-308', aula: 'C-105 · Pabellón C', dias: ['M', 'V'], horario: '16:00 – 18:00' }
  ]

  const diasSemana = ['L', 'M', 'X', 'J', 'V']
  const diasActivos = ['M', 'J']

  return (
    <div className="ac-page">
      <div className="ac-watermark" style={{ backgroundImage: `url(${fondoCampus})` }}></div>

      {/* BARRA SUPERIOR INSTITUCIONAL */}
      <header className="ac-top">
        <div className="ac-brand">
          <img src={logoEpiis} alt="Logo EPIIS" />
          <div className="ac-brand-text">INGENIERÍA<br />INFORMÁTICA Y DE<br />SISTEMAS</div>
        </div>
        <div className="ac-brand-divider"></div>
        <div className="ac-brand">
          <img src={logoUnsaac} alt="Logo UNSAAC" />
          <div className="ac-brand-text">UNSAAC<br /><span className="sub">Universidad Nacional de<br />San Antonio Abad del Cusco</span></div>
        </div>
      </header>

      <div className="ac-layout">
        {/* SIDEBAR con submenú expandido */}
        <aside className="ac-sidebar">
          <div className="ac-sidebar-title">ADMINISTRADOR</div>
          <div className="ac-nav-item"><span className="ac-icon ac-ico-dashboard"></span><span>Inicio</span></div>
          <div className="ac-nav-item"><span className="ac-icon ac-ico-users"></span><span>Docentes</span></div>
          <div className="ac-nav-item active"><span className="ac-icon ac-ico-clock"></span><span>Horarios</span></div>
          <div className="ac-nav-subitem">Configuración general</div>
          <div className="ac-nav-subitem">Tolerancia de marcación</div>
          <div className="ac-nav-subitem active">Asignación de cursos</div>
          <div className="ac-nav-item"><span className="ac-icon ac-ico-file"></span><span>Reportes</span></div>
          <div className="ac-nav-item"><span className="ac-icon ac-ico-shield"></span><span>Seguridad</span></div>
        </aside>

        {/* MAIN */}
        <main className="ac-main">
          <div className="ac-main-header">
            <div>
              <div className="ac-main-title">Asignación de cursos por docente</div>
              <div className="ac-main-subtitle">Asigna entre 1 y 5 cursos por docente, especificando aula, pabellón y horario</div>
            </div>
            <button className="ac-btn-primary"><span className="ac-ico-save"></span> Guardar cambios</button>
          </div>

          <div className="ac-master-detail">

            {/* MASTER: LISTA DE DOCENTES */}
            <div className="ac-master-card">
              <div className="ac-search-box">
                <span className="ac-search-icon"></span>
                <input type="text" placeholder="Buscar docente..." />
              </div>

              <div className="ac-filter-tabs">
                <span className="ac-filter-tab active">Todos (47)</span>
                <span className="ac-filter-tab">Completos (12)</span>
                <span className="ac-filter-tab">Sin asignar (3)</span>
              </div>

              <div className="ac-teacher-list">
                {docentes.map((d, i) => (
                  <div key={i} className={`ac-teacher-item ${d.selected ? 'selected' : ''}`}>
                    <div className="ac-teacher-avatar" style={{ background: d.color }}>{d.iniciales}</div>
                    <div className="ac-teacher-info">
                      <div className="ac-teacher-name">{d.nombre}</div>
                      <div className="ac-teacher-meta">{d.meta}</div>
                    </div>
                    <span className={`ac-teacher-count ${d.tipo}`}>{d.count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* DETAIL: DOCENTE SELECCIONADO */}
            <div className="ac-detail-card">

              <div className="ac-detail-header">
                <div className="ac-detail-header-top">
                  <div className="ac-detail-avatar">EQ</div>
                  <div>
                    <div className="ac-detail-name">Dr. Efraín Quispe Chura</div>
                    <div className="ac-detail-meta">
                      <span>Código D-1842</span>
                      <span>Departamento de Informática</span>
                      <span>quispe.efrain@unsaac.edu.pe</span>
                    </div>
                  </div>
                </div>
                <div className="ac-detail-stats">
                  <div className="ac-stat-block">
                    <div className="ac-stat-label">CURSOS ASIGNADOS</div>
                    <div className="ac-stat-value">4 <small>/ 5 máximo</small></div>
                  </div>
                  <div className="ac-stat-block">
                    <div className="ac-stat-label">HORAS SEMANALES</div>
                    <div className="ac-stat-value">16 <small>horas</small></div>
                  </div>
                  <div className="ac-stat-block">
                    <div className="ac-stat-label">PABELLONES</div>
                    <div className="ac-stat-value">3 <small>distintos</small></div>
                  </div>
                </div>
              </div>

              {/* TABLA DE CURSOS */}
              <div className="ac-courses-section">
                <div className="ac-courses-header">
                  <div className="ac-courses-title">Cursos asignados al semestre 2026-I</div>
                </div>
                <table className="ac-courses-table">
                  <thead>
                    <tr>
                      <th>CURSO</th>
                      <th>AULA · PABELLÓN</th>
                      <th>DÍAS</th>
                      <th>HORARIO</th>
                      <th style={{ textAlign: 'right' }}>ACCIONES</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cursos.map((c, i) => (
                      <tr key={i}>
                        <td>
                          <div className="ac-course-name">{c.nombre}</div>
                          <div className="ac-course-code">{c.codigo}</div>
                        </td>
                        <td>{c.aula}</td>
                        <td>
                          <div className="ac-day-chips">
                            {c.dias.map((d, j) => <span key={j} className="ac-day-chip">{d}</span>)}
                          </div>
                        </td>
                        <td>{c.horario}</td>
                        <td style={{ textAlign: 'right' }}>
                          <button className="ac-btn-edit">Editar</button>
                          <button className="ac-btn-delete">Quitar</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* PANEL ASIGNAR NUEVO CURSO */}
              <div className="ac-add-course-panel">
                <div className="ac-add-course-title">
                  <span className="ac-ico-plus-blue"></span>
                  Asignar nuevo curso (1 espacio disponible)
                </div>
                <div className="ac-form-grid">
                  <div className="ac-form-field">
                    <label>Curso del catálogo</label>
                    <select><option>Selecciona un curso...</option></select>
                  </div>
                  <div className="ac-form-field">
                    <label>Aula y pabellón</label>
                    <select><option>Selecciona un aula...</option></select>
                  </div>
                </div>
                <div className="ac-form-field" style={{ marginBottom: 14 }}>
                  <label>Días de la semana</label>
                  <div className="ac-days-selector">
                    {diasSemana.map((d, i) => (
                      <div key={i} className={`ac-day-selector-btn ${diasActivos.includes(d) ? 'active' : ''}`}>{d}</div>
                    ))}
                  </div>
                </div>
                <div className="ac-form-grid">
                  <div className="ac-form-field">
                    <label>Hora de inicio</label>
                    <input type="text" defaultValue="09:00 a.m." />
                  </div>
                  <div className="ac-form-field">
                    <label>Hora de fin</label>
                    <input type="text" defaultValue="11:00 a.m." />
                  </div>
                </div>
                <div className="ac-form-actions">
                  <button className="ac-btn-secondary">Cancelar</button>
                  <button className="ac-btn-add-course"><span className="ac-ico-plus-white"></span> Asignar curso</button>
                </div>
              </div>

            </div>
          </div>

          {/* FOOTER */}
          <div className="ac-footer-actions">
            <div className="ac-footer-text">Última actualización: hace 2 horas por admin@unsaac.edu.pe</div>
            <div className="ac-footer-buttons">
              <button className="ac-btn-secondary">Cancelar</button>
              <button className="ac-btn-primary">Guardar cambios</button>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
