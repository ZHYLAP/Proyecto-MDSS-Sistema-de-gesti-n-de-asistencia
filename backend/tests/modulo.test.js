import test from 'node:test';
import assert from 'node:assert/strict';
import { validateSchedule } from '../src/services/modulo.js';

test('permite guardar un horario cuando no hay cruce y hay menos de 5 cursos', () => {
  const result = validateSchedule({
    newSchedule: { day: 'Lunes', start: '08:00', end: '10:00' },
    existingSchedules: [
      { day: 'Martes', start: '09:00', end: '11:00' },
      { day: 'Miércoles', start: '12:00', end: '14:00' }
    ],
    maxCourses: 5
  });

  assert.equal(result.isValid, true);
  assert.deepEqual(result.errors, []);
});

test('rechaza un horario cuando existe un cruce de horas en el mismo día', () => {
  const result = validateSchedule({
    newSchedule: { day: 'Lunes', start: '09:00', end: '11:00' },
    existingSchedules: [
      { day: 'Lunes', start: '08:00', end: '10:00' }
    ],
    maxCourses: 5
  });

  assert.equal(result.isValid, false);
  assert.match(result.errors.join(' '), /cruce/i);
});

test('rechaza un horario cuando supera el límite de 5 cursos', () => {
  const existingSchedules = Array.from({ length: 5 }, (_, index) => ({
    day: 'Lunes',
    start: `${8 + index}:00`,
    end: `${9 + index}:00`
  }));

  const result = validateSchedule({
    newSchedule: { day: 'Lunes', start: '14:00', end: '16:00' },
    existingSchedules,
    maxCourses: 5
  });

  assert.equal(result.isValid, false);
  assert.match(result.errors.join(' '), /5 cursos/i);
});
