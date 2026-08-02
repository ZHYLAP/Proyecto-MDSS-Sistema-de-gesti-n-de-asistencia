import test from 'node:test';
import assert from 'node:assert/strict';
import {
  isAfterNineAM,
  classifyAttendance,
  hashFingerprint,
  buildSessionStart
} from '../src/services/attendance.js';

test('detecta que una hora después de las 09:00 es tardanza', () => {
  const date = new Date('2026-07-30T09:00:01');
  assert.equal(isAfterNineAM(date), true);
});

test('detecta que 09:00 exacto no es después de las 09:00', () => {
  const date = new Date('2026-07-30T09:00:00');
  assert.equal(isAfterNineAM(date), false);
});

test('clasifica asistencia correcta dentro del margen de 15/10 minutos', () => {
  const result = classifyAttendance({
    markedAt: '2026-07-30T08:05:00',
    officialStart: '2026-07-30T08:00:00',
    earlyToleranceMinutes: 15,
    lateToleranceMinutes: 10
  });

  assert.equal(result.allowed, true);
  assert.equal(result.status, 'tardanza');
  assert.equal(result.differenceMinutes, 5);
});

test('bloquea asistencia fuera del margen de tolerancia tardía', () => {
  const result = classifyAttendance({
    markedAt: '2026-07-30T08:11:00',
    officialStart: '2026-07-30T08:00:00',
    earlyToleranceMinutes: 15,
    lateToleranceMinutes: 10
  });

  assert.equal(result.allowed, false);
  assert.equal(result.status, 'rechazado');
  assert.equal(result.differenceMinutes, 11);
});

test('hash de huella devuelve valor SHA-256 consistente', () => {
  const template = 'fingerprint-template-1';
  const hash1 = hashFingerprint(template);
  const hash2 = hashFingerprint(template);

  assert.equal(hash1, hash2);
  assert.equal(hash1.length, 64);
});

test('construye fecha y hora de sesión en formato ISO', () => {
  const result = buildSessionStart('2026-07-30', '08:30:00');
  assert.equal(result, '2026-07-30T08:30:00');
});
