import test from 'node:test';
import assert from 'node:assert/strict';
import { validateSchedule, saveSchedule, evaluateAttendanceStatus } from '../src/services/modulo.js';

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

test('guarda un horario válido cuando el callback de persistencia se ejecuta', async () => {
  let persisted = false;

  const result = await saveSchedule({
    newSchedule: { day: 'Lunes', start: '08:00', end: '10:00' },
    existingSchedules: [],
    maxCourses: 5,
    persist: true,
    onPersist: async () => {
      persisted = true;
      return { saved: true };
    }
  });

  assert.equal(result.success, true);
  assert.equal(persisted, true);
});

test('rechaza el guardado cuando la validación falla incluso si se intenta persistir', async () => {
  let persisted = false;

  const result = await saveSchedule({
    newSchedule: { day: 'Lunes', start: '09:00', end: '11:00' },
    existingSchedules: [
      { day: 'Lunes', start: '08:00', end: '10:00' }
    ],
    maxCourses: 5,
    persist: true,
    onPersist: async () => {
      persisted = true;
      return { saved: true };
    }
  });

  assert.equal(result.success, false);
  assert.equal(persisted, false);
  assert.match(result.errors.join(' '), /cruce/i);
});

test('clasifica la asistencia como presente cuando la marcación está dentro del margen de tolerancia', () => {
  const result = evaluateAttendanceStatus({
    markedAt: '2026-07-07T08:05:00',
    officialStart: '2026-07-07T08:00:00',
    toleranceMinutes: 10
  });

  assert.equal(result.isAllowed, true);
  assert.equal(result.status, 'presente');
  assert.equal(result.differenceMinutes, 5);
});

test('clasifica como tardanza cuando la marcación excede el margen de tolerancia', () => {
  const result = evaluateAttendanceStatus({
    markedAt: '2026-07-07T08:16:00',
    officialStart: '2026-07-07T08:00:00',
    toleranceMinutes: 10
  });

  assert.equal(result.isAllowed, true);
  assert.equal(result.status, 'tardanza');
  assert.equal(result.differenceMinutes, 16);
});

test('niega la asistencia cuando la marcación es demasiado anticipada', () => {
  const result = evaluateAttendanceStatus({
    markedAt: '2026-07-07T07:40:00',
    officialStart: '2026-07-07T08:00:00',
    toleranceMinutes: 10
  });

  assert.equal(result.isAllowed, false);
  assert.equal(result.status, 'rechazado');
  assert.equal(result.differenceMinutes, -20);
});
