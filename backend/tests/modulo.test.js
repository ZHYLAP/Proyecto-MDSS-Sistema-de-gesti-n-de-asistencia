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

test('aplica la matriz de casos para bloquear asistencia fuera de los márgenes de 15/10 minutos', () => {
  const cases = [
    {
      name: 'permite marcar a tiempo',
      markedAt: '2026-07-07T08:00:00',
      officialStart: '2026-07-07T08:00:00',
      expectedAllowed: true,
      expectedStatus: 'presente'
    },
    {
      name: 'permite marcar 10 minutos tarde',
      markedAt: '2026-07-07T08:10:00',
      officialStart: '2026-07-07T08:00:00',
      expectedAllowed: true,
      expectedStatus: 'presente'
    },
    {
      name: 'permite marcar 15 minutos temprano',
      markedAt: '2026-07-07T07:45:00',
      officialStart: '2026-07-07T08:00:00',
      expectedAllowed: true,
      expectedStatus: 'presente'
    },
    {
      name: 'bloquea cuando se marca 16 minutos temprano',
      markedAt: '2026-07-07T07:44:00',
      officialStart: '2026-07-07T08:00:00',
      expectedAllowed: false,
      expectedStatus: 'rechazado'
    },
    {
      name: 'bloquea cuando se marca 11 minutos tarde',
      markedAt: '2026-07-07T08:11:00',
      officialStart: '2026-07-07T08:00:00',
      expectedAllowed: false,
      expectedStatus: 'rechazado'
    }
  ];

  cases.forEach(({ name, markedAt, officialStart, expectedAllowed, expectedStatus }) => {
    const result = evaluateAttendanceStatus({
      markedAt,
      officialStart,
      earlyToleranceMinutes: 15,
      lateToleranceMinutes: 10
    });

    assert.equal(result.isAllowed, expectedAllowed, name);
    assert.equal(result.status, expectedStatus, name);
  });
});
