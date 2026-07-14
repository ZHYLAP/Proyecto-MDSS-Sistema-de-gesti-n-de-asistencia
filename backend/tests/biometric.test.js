import test from 'node:test';
import assert from 'node:assert/strict';
import { createBiometricService } from '../src/services/biometric.js';

test('conecta con el lector y devuelve estado listo', async () => {
  const service = await createBiometricService({
    adapter: {
      async connect({ deviceId } = {}) {
        return { connected: true, deviceId, status: 'ready' };
      },
      async capture({ deviceId } = {}) {
        return { success: true, template: `template-${deviceId}`, quality: 95 };
      },
      async verify({ template, capturedTemplate } = {}) {
        return { success: true, match: template === capturedTemplate, score: 1 };
      },
      async getStatus() {
        return { connected: true, status: 'ready' };
      }
    }
  });

  const result = await service.connectDevice({ deviceId: 'reader-01' });

  assert.equal(result.connected, true);
  assert.equal(result.status, 'ready');
});

test('captura una huella y la valida correctamente', async () => {
  const service = await createBiometricService({
    adapter: {
      async connect() {
        return { connected: true, status: 'ready' };
      },
      async capture() {
        return { success: true, template: 'fingerprint-template', quality: 92 };
      },
      async verify({ template, capturedTemplate } = {}) {
        return { success: true, match: template === capturedTemplate, score: 1 };
      },
      async getStatus() {
        return { connected: true, status: 'ready' };
      }
    }
  });

  const captureResult = await service.captureFingerprint({ deviceId: 'reader-02' });
  const verifyResult = await service.verifyFingerprint({
    template: captureResult.template,
    capturedTemplate: captureResult.template
  });

  assert.equal(captureResult.success, true);
  assert.equal(verifyResult.match, true);
  assert.equal(verifyResult.success, true);
});

test('carga el adaptador biométrico SDK local y captura la huella', async () => {
  const originalMode = process.env.BIOMETRIC_MODE;
  const originalAdapterModule = process.env.BIOMETRIC_ADAPTER_MODULE;

  process.env.BIOMETRIC_MODE = 'sdk';
  process.env.BIOMETRIC_ADAPTER_MODULE = './src/services/biometricAdapter.js';

  const service = await createBiometricService();
  const status = await service.connectDevice({ deviceId: 'reader-03' });
  const captureResult = await service.captureFingerprint({ deviceId: 'reader-03' });

  assert.equal(status.connected, true);
  assert.equal(captureResult.success, true);
  assert.match(captureResult.template, /external-template-/);

  process.env.BIOMETRIC_MODE = originalMode;
  process.env.BIOMETRIC_ADAPTER_MODULE = originalAdapterModule;
});
