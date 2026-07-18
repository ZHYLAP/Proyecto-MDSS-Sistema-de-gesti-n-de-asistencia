// Datos de demostración basados en la carga académica real EPIIS-UNSAAC.
// Cuando llegue el Excel definitivo del equipo, se reemplaza aquí.

export const CONFIG_INSTITUCIONAL = {
  horaTope: '09:00',          // editable, 9 por defecto. Pasada esta hora => FALTA (sin tardanza)
  diasHabiles: ['L', 'M', 'X', 'J', 'V'],
}

export const TOLERANCIA = {
  entradaAntes: 15,   // min antes del inicio: abre lector
  entradaDespues: 10, // min después: pasado esto NO registra (sin tardanza)
  salidaAntes: 10,
  salidaDespues: 15,  // salida permisiva
}

// ── Docentes (extraídos de la carga académica EPIIS) ──────────────────────────
export const DOCENTES = [
  {
    codigo: 'D-1001', nombre: 'Waldo Elio Ibarra Zambrano', categoria: 'AS-TC',
    dpto: 'Ing. Informática y de Sistemas', huella: true,
    cursos: [
      { codigo: 'IF611AIN', nombre: 'Metodología de Desarrollo de Software', tipo: 'T', dia: 'Martes',    ini: '07:00', fin: '09:00', aula: 'IN108' },
      { codigo: 'IF468AIN', nombre: 'Fundamentos de la Programación',          tipo: 'T', dia: 'Martes',    ini: '16:00', fin: '18:00', aula: 'IN101' },
      { codigo: 'IF611AIN', nombre: 'Metodología de Desarrollo de Software', tipo: 'P', dia: 'Jueves',    ini: '07:00', fin: '09:00', aula: 'L-306' },
    ],
  },
  {
    codigo: 'D-1002', nombre: 'Dennis Iván Candia Oviedo', categoria: 'AS-TC',
    dpto: 'Ing. Informática y de Sistemas', huella: true,
    cursos: [
      { codigo: 'IF210AIN', nombre: 'Planeamiento Estratégico',                          tipo: 'T', dia: 'Lunes',     ini: '09:00', fin: '11:00', aula: 'IN202' },
      { codigo: 'IF902CEU', nombre: 'Tecnologías de la Información y la Comunicación',    tipo: 'T', dia: 'Lunes',     ini: '11:00', fin: '13:00', aula: 'D-111' },
      { codigo: 'IF610AIN', nombre: 'Análisis y Diseño de Sistemas de Información',       tipo: 'P', dia: 'Jueves',    ini: '09:00', fin: '11:00', aula: 'L-305' },
    ],
  },
  {
    codigo: 'D-1003', nombre: 'Edwin Carrasco Poblete', categoria: 'PR-TC',
    dpto: 'Ing. Informática y de Sistemas', huella: true,
    cursos: [
      { codigo: 'IF552AIN', nombre: 'Redes de Computadoras I', tipo: 'P', dia: 'Lunes',     ini: '09:00', fin: '11:00', aula: 'L-206' },
      { codigo: 'IF505AIN', nombre: 'Redes y Teleproceso I',   tipo: 'T', dia: 'Martes',    ini: '09:00', fin: '11:00', aula: 'IN202' },
      { codigo: 'IF552AIN', nombre: 'Redes de Computadoras I', tipo: 'T', dia: 'Miércoles', ini: '09:00', fin: '11:00', aula: 'IN201' },
    ],
  },
  {
    codigo: 'D-1004', nombre: 'Julio César Carbajal Luna', categoria: 'PR-DE',
    dpto: 'Ing. Informática y de Sistemas', huella: true,
    cursos: [
      { codigo: 'IF167AFI', nombre: 'Programación Científica',          tipo: 'T', dia: 'Lunes',     ini: '07:00', fin: '09:00', aula: 'K-101' },
      { codigo: 'IF468BIN', nombre: 'Fundamentos de la Programación',   tipo: 'P', dia: 'Lunes',     ini: '11:00', fin: '13:00', aula: 'L-305' },
    ],
  },
  {
    codigo: 'D-1005', nombre: 'Javier David Chávez Centeno', categoria: 'AS-TC',
    dpto: 'Ing. Informática y de Sistemas', huella: false,
    cursos: [
      { codigo: 'IF453CIN', nombre: 'Programación II',        tipo: 'P', dia: 'Martes', ini: '09:00', fin: '11:00', aula: 'L-303' },
      { codigo: 'IF107ALI', nombre: 'Programación Digital I', tipo: 'T', dia: 'Martes', ini: '11:00', fin: '13:00', aula: 'EL-206' },
    ],
  },
  {
    codigo: 'D-1006', nombre: 'Yeshica Isela Ormeño Ayala', categoria: 'AS-DE',
    dpto: 'Ing. Informática y de Sistemas', huella: true,
    cursos: [
      { codigo: 'IF209AIN', nombre: 'Ingeniería de Software', tipo: 'T', dia: 'Lunes', ini: '09:00', fin: '11:00', aula: 'IN203' },
    ],
  },
]

export const getDocente = (codigo) => DOCENTES.find((d) => d.codigo === codigo)

// ── Escenarios de marcación por huella (modo demo del sensor) ─────────────────
// Cada uno describe qué se muestra en la Estación Central al leer la huella.
export const ESCENARIOS = [
  {
    id: 'inst', label: 'Solo institucional', hint: 'Antes de las 09:00, sin curso próximo',
    tone: 'ok', docente: 'D-1002', hora: '08:41', detectado: null,
    mensajes: [
      { t: 'ok', txt: 'Asistencia institucional registrada', sub: '08:41 a.m. · dentro de la hora tope (09:00)' },
    ],
  },
  {
    id: 'ambas', label: 'Institucional + curso', hint: 'Antes de las 09:00 y con curso en ventana',
    tone: 'ok', docente: 'D-1002', hora: '08:52', detectado: 'IF210AIN',
    mensajes: [
      { t: 'ok', txt: 'Asistencia institucional registrada', sub: '08:52 a.m. · dentro de la hora tope' },
      { t: 'ok', txt: 'Asistencia al curso registrada',      sub: 'IF210AIN · Planeamiento Estratégico · IN202' },
    ],
  },
  {
    id: 'curso', label: 'Solo curso', hint: 'Ya tenía institucional registrado hoy',
    tone: 'ok', docente: 'D-1003', hora: '09:03', detectado: 'IF552AIN',
    mensajes: [
      { t: 'info', txt: 'Institucional ya registrada hoy', sub: 'Marcada a las 08:20 a.m.' },
      { t: 'ok',   txt: 'Asistencia al curso registrada',  sub: 'IF552AIN · Redes de Computadoras I · L-206' },
    ],
  },
  {
    id: 'encadenado', label: 'Curso encadenado', hint: 'Salida de un curso y entrada al siguiente en una marca',
    tone: 'ok', docente: 'D-1001', hora: '09:00', detectado: 'IF611AIN',
    mensajes: [
      { t: 'ok', txt: 'Salida y entrada registradas', sub: 'Salida de IF468 → entrada a IF611 en una sola marca' },
    ],
  },
  {
    id: 'fuera_hora', label: 'Fuera de horario', hint: 'Después de la hora tope, sin ventana activa',
    tone: 'warn', docente: 'D-1001', hora: '09:18', detectado: null,
    mensajes: [
      { t: 'warn', txt: 'Fuera de hora — registro no válido', sub: 'Pasó la hora tope. Contacte al Director de Escuela' },
    ],
  },
  {
    id: 'fuera_ventana', label: 'Curso fuera de ventana', hint: 'Pasaron +10 min del inicio del curso',
    tone: 'warn', docente: 'D-1003', hora: '09:14', detectado: 'IF552AIN',
    mensajes: [
      { t: 'warn', txt: 'Ventana del curso cerrada', sub: 'Pasaron más de 10 min. El curso no se registró (sin tardanza)' },
    ],
  },
  {
    id: 'no_reconocida', label: 'Huella no reconocida', hint: 'No coincide con ningún docente',
    tone: 'bad', docente: null, hora: '08:47', detectado: null,
    mensajes: [
      { t: 'bad', txt: 'Huella no reconocida', sub: 'Intente nuevamente o acérquese a Secretaría de la Escuela' },
    ],
  },
]

// Historial del docente logueado (detrás de "Mis asistencias")
export const HISTORIAL = [
  { fecha: '2026-07-15', tipo: 'Institucional', hora: '08:41', estado: 'ok',    detalle: 'Ingreso registrado' },
  { fecha: '2026-07-15', tipo: 'Curso IF611AIN', hora: '06:58', estado: 'ok',   detalle: 'Entrada dentro de ventana' },
  { fecha: '2026-07-14', tipo: 'Institucional', hora: '09:12', estado: 'falta', detalle: 'Fuera de hora — contactar Director de Escuela' },
  { fecha: '2026-07-14', tipo: 'Curso IF468AIN', hora: '16:03', estado: 'ok',   detalle: 'Entrada dentro de ventana' },
  { fecha: '2026-07-11', tipo: 'Curso IF611AIN', hora: '07:05', estado: 'ok',   detalle: 'Entrada dentro de ventana' },
]

// Monitoreo de aulas (Admin)
export const AULAS_MONITOREO = [
  { aula: 'IN108', curso: 'IF611AIN Metodología Desarrollo Soft.', docente: 'W. Ibarra Zambrano', estado: 'ok',          hora: '07:00–09:00' },
  { aula: 'IN202', curso: 'IF505AIN Redes y Teleproceso I',        docente: 'E. Carrasco Poblete', estado: 'ok',          hora: '09:00–11:00' },
  { aula: 'L-303', curso: 'IF453CIN Programación II',              docente: '—',                   estado: 'sin-registro', hora: '09:00–11:00' },
  { aula: 'K-101', curso: 'IF167AFI Programación Científica',      docente: '—',                   estado: 'sin-registro', hora: '07:00–09:00' },
]

export const REPORTE_FILAS = [
  { fecha: '2026-07-15', docente: 'Waldo Ibarra Zambrano', curso: 'IF611AIN', tipo: 'Curso',         estado: 'Registrado', hora: '06:58' },
  { fecha: '2026-07-15', docente: 'Dennis Candia Oviedo',  curso: '—',        tipo: 'Institucional', estado: 'Registrado', hora: '08:41' },
  { fecha: '2026-07-14', docente: 'Waldo Ibarra Zambrano', curso: '—',        tipo: 'Institucional', estado: 'Falta',      hora: '09:12' },
  { fecha: '2026-07-14', docente: 'Edwin Carrasco Poblete', curso: 'IF552AIN', tipo: 'Curso',        estado: 'Registrado', hora: '08:56' },
  { fecha: '2026-07-11', docente: 'Julio Carbajal Luna',   curso: 'IF167AFI', tipo: 'Curso',         estado: 'Registrado', hora: '07:05' },
]

// Credenciales de demostración
export const CREDENCIALES = {
  'admin':  { pass: 'admin123',   role: 'admin',   codigo: 'admin',  nombre: 'Administrador EPIIS' },
  'D-1001': { pass: 'docente123', role: 'docente', codigo: 'D-1001', nombre: 'Waldo Elio Ibarra Zambrano' },
}
