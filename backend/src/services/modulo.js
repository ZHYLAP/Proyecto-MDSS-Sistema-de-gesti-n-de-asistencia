const normalizeTime = (value) => {
  if (typeof value !== 'string') {
    return null;
  }

  const trimmedValue = value.trim();
  return trimmedValue.length >= 5 ? trimmedValue.slice(0, 5) : trimmedValue;
};

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

export function validateSchedule({ newSchedule, existingSchedules = [], maxCourses = 5 }) {
  const errors = [];
  const normalizedMaxCourses = Number(maxCourses) || 5;
  const schedules = Array.isArray(existingSchedules) ? existingSchedules : [];

  if (schedules.length >= normalizedMaxCourses) {
    errors.push(`Un docente no puede tener más de ${normalizedMaxCourses} cursos.`);
  }

  const normalizedNewSchedule = {
    day: newSchedule?.day?.trim(),
    start: normalizeTime(newSchedule?.start),
    end: normalizeTime(newSchedule?.end)
  };

  if (!normalizedNewSchedule.day || !normalizedNewSchedule.start || !normalizedNewSchedule.end) {
    errors.push('El horario debe incluir día, hora de inicio y hora de fin.');
  }

  const startInMinutes = timeToMinutes(normalizedNewSchedule.start);
  const endInMinutes = timeToMinutes(normalizedNewSchedule.end);
  if (startInMinutes !== null && endInMinutes !== null && startInMinutes >= endInMinutes) {
    errors.push('La hora de inicio debe ser menor que la hora de fin.');
  }

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

export async function saveSchedule({
  newSchedule,
  existingSchedules = [],
  maxCourses = 5,
  persist = false,
  onPersist
}) {
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

export function evaluateAttendanceStatus({ markedAt, officialStart, toleranceMinutes = 10 }) {
  const normalizedTolerance = Number(toleranceMinutes) || 0;
  const markedDate = new Date(markedAt);
  const officialDate = new Date(officialStart);

  if (Number.isNaN(markedDate.getTime()) || Number.isNaN(officialDate.getTime())) {
    return {
      isAllowed: false,
      status: 'rechazado',
      differenceMinutes: null,
      message: 'Las fechas de marcación e inicio oficial no son válidas.'
    };
  }

  const differenceMinutes = Math.round((markedDate.getTime() - officialDate.getTime()) / 60000);

  if (differenceMinutes < 0) {
    return {
      isAllowed: false,
      status: 'rechazado',
      differenceMinutes,
      message: 'La marcación es anterior al inicio oficial de la sesión.'
    };
  }

  if (differenceMinutes <= normalizedTolerance) {
    return {
      isAllowed: true,
      status: 'presente',
      differenceMinutes,
      message: 'Marcación dentro del rango de tolerancia.'
    };
  }

  return {
    isAllowed: true,
    status: 'tardanza',
    differenceMinutes,
    message: 'La marcación supera el margen de tolerancia.'
  };
}