// Normaliza una hora recibida como texto para dejarla en formato HH:MM.
const normalizeTime = (value) => {
  if (typeof value !== 'string') {
    return null;
  }

  const trimmedValue = value.trim();
  return trimmedValue.length >= 5 ? trimmedValue.slice(0, 5) : trimmedValue;
};

// Convierte una hora en minutos para facilitar la comparación entre rangos.
const timeToMinutes = (value) => {
  if (!value) {
    return null;
  }

  const [hours, minutes] = value.split(':').map(Number);
  if (Number.isNaN(hours) || Number.isNaN(minutes)) {
    return null;
  }

  return hours * 60 + minutes;
};

// Determina si dos horarios se solapan en el mismo día.
const hasTimeOverlap = (newSchedule, existingSchedule) => {
  if (!newSchedule || !existingSchedule) {
    return false;
  }

  const normalizedNewDay = (newSchedule.day || '').toLowerCase().trim();
  const normalizedExistingDay = (existingSchedule.day || '').toLowerCase().trim();

  if (normalizedNewDay !== normalizedExistingDay) {
    return false;
  }

  const newStart = timeToMinutes(newSchedule.start);
  const newEnd = timeToMinutes(newSchedule.end);
  const existingStart = timeToMinutes(existingSchedule.start);
  const existingEnd = timeToMinutes(existingSchedule.end);

  if (newStart === null || newEnd === null || existingStart === null || existingEnd === null) {
    return false;
  }

  return newStart < existingEnd && existingStart < newEnd;
};

// Valida si un nuevo horario puede registrarse sin violar reglas de negocio.
export function validateSchedule({ newSchedule, existingSchedules = [], maxCourses = 5 }) {
  const errors = [];
  const normalizedMaxCourses = Number(maxCourses) || 5;
  const schedules = Array.isArray(existingSchedules) ? existingSchedules : [];

  // Regla: un docente no puede tener más cursos que el máximo permitido.
  if (schedules.length >= normalizedMaxCourses) {
    errors.push(`Un docente no puede tener más de ${normalizedMaxCourses} cursos.`);
  }

  // Se normalizan los datos del nuevo horario antes de validar.
  const normalizedNewSchedule = {
    day: newSchedule?.day?.trim(),
    start: normalizeTime(newSchedule?.start),
    end: normalizeTime(newSchedule?.end)
  };

  // Regla: el horario debe contener todos los campos obligatorios.
  if (!normalizedNewSchedule.day || !normalizedNewSchedule.start || !normalizedNewSchedule.end) {
    errors.push('El horario debe incluir día, hora de inicio y hora de fin.');
  }

  // Regla: la hora de inicio debe ser menor que la hora de fin.
  const startInMinutes = timeToMinutes(normalizedNewSchedule.start);
  const endInMinutes = timeToMinutes(normalizedNewSchedule.end);
  if (startInMinutes !== null && endInMinutes !== null && startInMinutes >= endInMinutes) {
    errors.push('La hora de inicio debe ser menor que la hora de fin.');
  }

  // Regla: no puede existir cruce con horarios ya asignados en el mismo día.
  schedules.forEach((existingSchedule) => {
    if (hasTimeOverlap(normalizedNewSchedule, existingSchedule)) {
      errors.push('Hay un cruce de horarios en el mismo día.');
    }
  });

  return {
    isValid: errors.length === 0,
    errors
  };
}

// Guarda un horario solo si pasa la validación; opcionalmente puede persistir.
export async function saveSchedule({
  newSchedule,
  existingSchedules = [],
  maxCourses = 5,
  persist = false,
  onPersist
}) {
  // Se ejecuta la validación previa al guardado.
  const validation = validateSchedule({
    newSchedule,
    existingSchedules,
    maxCourses
  });

  if (!validation.isValid) {
    return {
      success: false,
      message: 'No se puede guardar el horario.',
      errors: validation.errors
    };
  }

  // Si no se solicita persistencia, solo se devuelve un resultado de validación.
  if (!persist) {
    return {
      success: true,
      message: 'Horario válido y listo para guardar.',
      data: {
        newSchedule,
        existingSchedules,
        maxCourses
      }
    };
  }

  // La persistencia solo puede ocurrir si se proporciona un callback válido.
  if (typeof onPersist !== 'function') {
    return {
      success: false,
      message: 'No se ha proporcionado un handler de persistencia.',
      errors: ['No se ha proporcionado un handler de persistencia.']
    };
  }

  try {
    const persistedData = await onPersist({ newSchedule, existingSchedules, maxCourses });

    return {
      success: true,
      message: 'Horario guardado correctamente.',
      data: persistedData
    };
  } catch (error) {
    return {
      success: false,
      message: 'No se pudo guardar el horario en la base de datos.',
      errors: [error.message || 'Error inesperado al guardar el horario.']
    };
  }
}

// Evalúa si una marcación de asistencia está permitida según los márgenes de tolerancia.
export function evaluateAttendanceStatus({
  markedAt,
  officialStart,
  earlyToleranceMinutes = 15,
  lateToleranceMinutes,
  toleranceMinutes
}) {
  // Se definen los márgenes de tolerancia para entrada temprana y tardía.
  const normalizedEarlyTolerance = Number(earlyToleranceMinutes) || 0;
  const normalizedLateTolerance = Number(lateToleranceMinutes ?? toleranceMinutes ?? 10) || 0;
  const markedDate = new Date(markedAt);
  const officialDate = new Date(officialStart);

  // Si alguna fecha es inválida, la asistencia se rechaza.
  if (Number.isNaN(markedDate.getTime()) || Number.isNaN(officialDate.getTime())) {
    return {
      isAllowed: false,
      status: 'rechazado',
      differenceMinutes: null,
      message: 'Las fechas de marcación e inicio oficial no son válidas.'
    };
  }

  // Calcula la diferencia en minutos entre la marca y el inicio oficial.
  const differenceMinutes = Math.round((markedDate.getTime() - officialDate.getTime()) / 60000);

  // Caso de marcación anticipada: se permite solo si no excede el margen temprano.
  if (differenceMinutes < 0) {
    const earlyDifference = Math.abs(differenceMinutes);

    if (earlyDifference > normalizedEarlyTolerance) {
      return {
        isAllowed: false,
        status: 'rechazado',
        differenceMinutes,
        message: 'La marcación es demasiado anticipada para la sesión.'
      };
    }

    return {
      isAllowed: true,
      status: 'presente',
      differenceMinutes,
      message: 'Marcación dentro del rango de tolerancia temprana.'
    };
  }

  // Caso de marcación tardía: se permite solo si no excede el margen tardío.
  if (differenceMinutes <= normalizedLateTolerance) {
    return {
      isAllowed: true,
      status: 'presente',
      differenceMinutes,
      message: 'Marcación dentro del rango de tolerancia tardía.'
    };
  }

  // Si supera el margen tardío, la asistencia queda rechazada.
  return {
    isAllowed: false,
    status: 'rechazado',
    differenceMinutes,
    message: 'La marcación supera el margen de tolerancia tardía.'
  };
}
// prueba 
