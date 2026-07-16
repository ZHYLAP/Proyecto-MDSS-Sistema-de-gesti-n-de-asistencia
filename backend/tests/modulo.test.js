import test from 'node:test';
import assert from 'node:assert/strict';
import { validateSchedule, saveSchedule, evaluateAttendanceStatus } from '../src/services/modulo.js';

// Prueba que valida que un horario nuevo sea aceptado cuando no existe conflicto
// con horarios previos y no se supera el límite máximo de cursos.
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

// Prueba que confirma que un horario se rechaza cuando se cruza con otro
// ya registrado en el mismo día.
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

// Prueba que verifica la regla de negocio del máximo de cursos permitidos por docente.
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

// Prueba que valida el flujo de guardado cuando la información es correcta
// y el callback de persistencia se ejecuta correctamente.
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

// Prueba que asegura que no se persiste ningún cambio si la validación del horario falla.
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

// Prueba que recorre una matriz de casos para verificar el comportamiento de la asistencia
// cuando la marcación se realiza dentro o fuera de los márgenes de tolerancia.
test('aplica la matriz de casos para bloquear asistencia fuera de los márgenes de 15/10 minutos', () => {
  // Cada caso define una hora de marcación y el resultado esperado.
  const cases = [
    {
      name: 'permite marcar exactamente a tiempo',
      markedAt: '2026-07-07T08:00:00',
      officialStart: '2026-07-07T08:00:00',
      expectedAllowed: true,
      expectedStatus: 'presente',
      expectedDifferenceMinutes: 0
    },
    {
      name: 'permite marcar 1 minuto temprano',
      markedAt: '2026-07-07T07:59:00',
      officialStart: '2026-07-07T08:00:00',
      expectedAllowed: true,
      expectedStatus: 'presente',
      expectedDifferenceMinutes: -1
    },
    {
      name: 'permite marcar 15 minutos temprano',
      markedAt: '2026-07-07T07:45:00',
      officialStart: '2026-07-07T08:00:00',
      expectedAllowed: true,
      expectedStatus: 'presente',
      expectedDifferenceMinutes: -15
    },
    {
      name: 'bloquea cuando se marca 16 minutos temprano',
      markedAt: '2026-07-07T07:44:00',
      officialStart: '2026-07-07T08:00:00',
      expectedAllowed: false,
      expectedStatus: 'rechazado',
      expectedDifferenceMinutes: -16
    },
    {
      name: 'permite marcar 1 minuto tarde',
      markedAt: '2026-07-07T08:01:00',
      officialStart: '2026-07-07T08:00:00',
      expectedAllowed: true,
      expectedStatus: 'presente',
      expectedDifferenceMinutes: 1
    },
    {
      name: 'permite marcar 10 minutos tarde',
      markedAt: '2026-07-07T08:10:00',
      officialStart: '2026-07-07T08:00:00',
      expectedAllowed: true,
      expectedStatus: 'presente',
      expectedDifferenceMinutes: 10
    },
    {
      name: 'bloquea cuando se marca 11 minutos tarde',
      markedAt: '2026-07-07T08:11:00',
      officialStart: '2026-07-07T08:00:00',
      expectedAllowed: false,
      expectedStatus: 'rechazado',
      expectedDifferenceMinutes: 11
    }
  ];

  // Se ejecuta cada caso y se comparan los resultados obtenidos con los esperados.
  cases.forEach(({ name, markedAt, officialStart, expectedAllowed, expectedStatus, expectedDifferenceMinutes }) => {
    const result = evaluateAttendanceStatus({
      markedAt,
      officialStart,
      earlyToleranceMinutes: 15,
      lateToleranceMinutes: 10
    });

    assert.equal(result.isAllowed, expectedAllowed, name);
    assert.equal(result.status, expectedStatus, name);
    assert.equal(result.differenceMinutes, expectedDifferenceMinutes, name);
  });
});
