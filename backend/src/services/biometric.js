import path from 'node:path';
import { pathToFileURL } from 'node:url';

const DEFAULT_DEVICE_ID = process.env.BIOMETRIC_DEVICE_ID || 'mock-reader';
const DEFAULT_TIMEOUT_MS = Number(process.env.BIOMETRIC_TIMEOUT_MS || 10000);

function createMockAdapter() {
  return {
    async connect({ deviceId = DEFAULT_DEVICE_ID } = {}) {
      return {
        connected: true,
        deviceId,
        status: 'ready',
        mode: 'mock',
        message: 'Adaptador biométrico simulado listo.'
      };
    },

    async capture({ deviceId = DEFAULT_DEVICE_ID, timeoutMs = DEFAULT_TIMEOUT_MS } = {}) {
      return {
        success: true,
        deviceId,
        timeoutMs,
        template: `mock-template-${Date.now()}`,
        quality: 95,
        message: 'Huella capturada correctamente.'
      };
    },

    async verify({ template, capturedTemplate } = {}) {
      return {
        success: true,
        match: Boolean(template) && template === capturedTemplate,
        score: template && capturedTemplate && template === capturedTemplate ? 1 : 0,
        message: template && capturedTemplate && template === capturedTemplate
          ? 'Coincidencia biométrica válida.'
          : 'No se encontró coincidencia.'
      };
    },

    async getStatus() {
      return {
        connected: true,
        status: 'ready',
        mode: 'mock',
        deviceId: DEFAULT_DEVICE_ID
      };
    }
  };
}

async function createExternalAdapter() {
  const modulePath = process.env.BIOMETRIC_ADAPTER_MODULE
    || process.env.BIOMETRIC_SDK_MODULE
    || './src/services/biometricAdapter.js';

  if (!modulePath) {
    return createMockAdapter();
  }

  try {
    const resolvedPath = path.isAbsolute(modulePath)
      ? modulePath
      : path.resolve(process.cwd(), modulePath);
    const moduleUrl = pathToFileURL(resolvedPath).href;
    const sdkModule = await import(moduleUrl);
    const exported = sdkModule.default || sdkModule;

    if (typeof exported === 'function') {
      const adapterInstance = await exported({
        deviceId: DEFAULT_DEVICE_ID,
        timeoutMs: DEFAULT_TIMEOUT_MS
      });

      if (adapterInstance && typeof adapterInstance.connect === 'function') {
        return adapterInstance;
      }
    }

    if (exported && typeof exported.createAdapter === 'function') {
      const adapterInstance = await exported.createAdapter({
        deviceId: DEFAULT_DEVICE_ID,
        timeoutMs: DEFAULT_TIMEOUT_MS
      });

      if (adapterInstance && typeof adapterInstance.connect === 'function') {
        return adapterInstance;
      }
    }

    if (exported && typeof exported.connect === 'function') {
      return exported;
    }

    throw new Error('El módulo externo no expone un adaptador biométrico válido.');
  } catch (error) {
    console.warn('No se pudo cargar el adaptador biométrico externo, se usará el modo simulado.', error.message);
    return createMockAdapter();
  }
}

export async function createBiometricService({ adapter } = {}) {
  const activeAdapter = adapter || (process.env.BIOMETRIC_MODE === 'sdk' ? await createExternalAdapter() : createMockAdapter());

  return {
    async connectDevice(payload = {}) {
      return activeAdapter.connect(payload);
    },

    async captureFingerprint(payload = {}) {
      return activeAdapter.capture(payload);
    },

    async verifyFingerprint(payload = {}) {
      return activeAdapter.verify(payload);
    },

    async getDeviceStatus(payload = {}) {
      return activeAdapter.getStatus(payload);
    }
  };
}

export default createBiometricService;
