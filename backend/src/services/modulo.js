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