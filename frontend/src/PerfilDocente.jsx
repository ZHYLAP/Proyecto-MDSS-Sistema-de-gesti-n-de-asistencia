import './PerfilDocente.css'
import logoEpiis from '../../assets/logo-epiis.png'
import logoUnsaac from '../../assets/logo-unsaac.png'
import fondoCampus from '../../assets/fondo-campus.jpg'

// Tarea 67 - Perfil del docente: historial de asistencia
// Diseño: Dominic Flores (UX/UI)
export default function PerfilDocente() {

  const marcaciones = [
    { fecha: '23 may 2026', dia: 'Viernes', curso: 'Algoritmos · IF-204', aula: 'A-304', hora: '08:42 a.m.', estado: 'A tiempo', tipo: 'success' },
    { fecha: '23 may 2026', dia: 'Viernes', curso: 'Bases de Datos · IF-301', aula: 'B-201', hora: '11:14 a.m.', estado: 'Tardanza', tipo: 'warning' },
    { fecha: '22 may 2026', dia: 'Jueves', curso: 'Algoritmos · IF-204', aula: 'A-304', hora: '08:35 a.m.', estado: 'A tiempo', tipo: 'success' },
    { fecha: '21 may 2026', dia: 'Miércoles', curso: 'Compiladores · IF-405', aula: 'A-110', hora: '—', estado: 'Falta', tipo: 'danger' },
    { fecha: '20 may 2026', dia: 'Martes', curso: 'Redes · IF-308', aula: 'C-105', hora: '03:58 p.m.', estado: 'A tiempo', tipo: 'success' },
    { fecha: '20 may 2026', dia: 'Martes', curso: 'Bases de Datos · IF-301', aula: 'B-201', hora: '10:56 a.m.', estado: 'A tiempo', tipo: 'success' }
  ]

  return (
    <div className="pd-page">
      <div className="pd-watermark" style={{ backgroundImage: `url(${fondoCampus})` }}></div>

      {/* TOP BAR AZUL con logos + info */}
      <header className="pd-topbar">
        <div className="pd-topbar-left">
          <img src={logoEpiis} alt="EPIIS" className="pd-logo" />
          <img src={logoUnsaac} alt="UNSAAC" className="pd-logo" />
          <div className="pd-topbar-text">
            <div className="pd-topbar-title">Sistema de Control de Asistencia Docente</div>
            <div className="pd-topbar-sub">UNSAAC · Escuela Profesional de Ingeniería Informática y de Sistemas</div>
          </div>
        </div>
        <div className="pd-topbar-user">
          <div className="pd-topbar-avatar">EQ</div>
          <span>Dr. Efraín Quispe</span>
        </div>
      </header>

      <div className="pd-content">

        {/* PROFILE HEADER */}
        <div className="pd-profile-header">
          <div className="pd-profile-avatar">EQ</div>
          <div className="pd-profile-info">
            <div className="pd-profile-name">Dr. Efraín Quispe Chura</div>
            <div className="pd-profile-meta">
              <span><span className="pd-meta-ico pd-ico-id"></span> Código D-1842</span>
              <span><span className="pd-meta-ico pd-ico-building"></span> Departamento de Informática</span>
              <span><span className="pd-meta-ico pd-ico-mail"></span> quispe.efrain@unsaac.edu.pe</span>
            </div>
          </div>
          <div className="pd-profile-period">
            <div className="pd-profile-period-label">PERIODO CONSULTADO</div>
            <div className="pd-profile-period-value">Semestre 2026-I</div>
          </div>
        </div>

        {/* STATS ROW */}
        <div className="pd-stats-row">
          <div className="pd-stat-card">
            <div className="pd-stat-top">
              <span className="pd-stat-label">Asistencias</span>
              <span className="pd-stat-icon success"><span className="pd-stat-icon-svg pd-ico-check"></span></span>
            </div>
            <div className="pd-stat-value success">38</div>
            <div className="pd-stat-sub">de 42 sesiones</div>
          </div>
          <div className="pd-stat-card">
            <div className="pd-stat-top">
              <span className="pd-stat-label">Tardanzas</span>
              <span className="pd-stat-icon warning"><span className="pd-stat-icon-svg pd-ico-clock"></span></span>
            </div>
            <div className="pd-stat-value warning">3</div>
            <div className="pd-stat-sub">este semestre</div>
          </div>
          <div className="pd-stat-card">
            <div className="pd-stat-top">
              <span className="pd-stat-label">Faltas</span>
              <span className="pd-stat-icon danger"><span className="pd-stat-icon-svg pd-ico-x"></span></span>
            </div>
            <div className="pd-stat-value danger">1</div>
            <div className="pd-stat-sub">justificada: 0</div>
          </div>
          <div className="pd-stat-card">
            <div className="pd-stat-top">
              <span className="pd-stat-label">Cumplimiento</span>
              <span className="pd-stat-icon info"><span className="pd-stat-icon-svg pd-ico-percent"></span></span>
            </div>
            <div className="pd-stat-value info">95%</div>
            <div className="pd-stat-sub">sobre el total</div>
          </div>
        </div>

        {/* HISTORIAL */}
        <div className="pd-history-card">
          <div className="pd-history-header">
            <div className="pd-history-title">Historial de marcaciones</div>
            <div className="pd-history-filters">
              <select className="pd-filter-select">
                <option>Todos los cursos</option>
                <option>Algoritmos</option>
                <option>Bases de Datos</option>
              </select>
              <select className="pd-filter-select">
                <option>Mayo 2026</option>
                <option>Abril 2026</option>
                <option>Todo el semestre</option>
              </select>
            </div>
          </div>

          <div className="pd-history-tabs">
            <div className="pd-history-tab active">Todas</div>
            <div className="pd-history-tab">A tiempo</div>
            <div className="pd-history-tab">Tardanzas</div>
            <div className="pd-history-tab">Faltas</div>
          </div>

          <table className="pd-history-table">
            <thead>
              <tr>
                <th style={{ width: 140 }}>Fecha</th>
                <th>Curso</th>
                <th style={{ width: 110 }}>Aula</th>
                <th style={{ width: 110 }}>Hora marcación</th>
                <th style={{ width: 140 }}>Estado</th>
              </tr>
            </thead>
            <tbody>
              {marcaciones.map((m, i) => (
                <tr key={i}>
                  <td>
                    <div className="pd-date-cell">{m.fecha}</div>
                    <div className="pd-date-sub">{m.dia}</div>
                  </td>
                  <td>{m.curso}</td>
                  <td>{m.aula}</td>
                  <td>{m.hora}</td>
                  <td>
                    <span className={`pd-badge ${m.tipo}`}>
                      <span className="pd-badge-dot"></span> {m.estado}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  )
}
