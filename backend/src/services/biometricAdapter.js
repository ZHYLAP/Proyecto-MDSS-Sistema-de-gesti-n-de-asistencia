const DEFAULT_DEVICE_ID = process.env.BIOMETRIC_DEVICE_ID || 'external-reader';
const DEFAULT_TIMEOUT_MS = Number(process.env.BIOMETRIC_TIMEOUT_MS || 10000);

export default async function createBiometricAdapter({ deviceId = DEFAULT_DEVICE_ID, timeoutMs = DEFAULT_TIMEOUT_MS } = {}) {
  /**
   * Este es un adaptador de ejemplo para la integración con un SDK/driver
   * real de lector biométrico.
   *
   * Reemplaza esta implementación por el SDK específico de tu proveedor.
   * Ejemplos:
   *   const sdk = await import('vendor-biometric-sdk');
   *   await sdk.initialize({ deviceId, timeoutMs });
   *   return {
   *     connect: sdk.connect.bind(sdk),
   *     capture: sdk.capture.bind(sdk),
   *     verify: sdk.verify.bind(sdk),
   *     getStatus: sdk.getStatus.bind(sdk)
   *   };
   */

  return {
    async connect() {
      return {
        connected: true,
        deviceId,
        status: 'ready',
        mode: 'external',
        message: 'Adaptador biométrico externo cargado. Sustituye este stub por el SDK real.'
      };
    },

    async capture({ deviceId: captureDeviceId = deviceId, timeoutMs: captureTimeoutMs = timeoutMs } = {}) {
      return {
        success: true,
        deviceId: captureDeviceId,
        timeoutMs: captureTimeoutMs,
        template: `external-template-${Date.now()}`,
        quality: 100,
        message: 'Captura de huella simulada por el adaptador externo. Reemplaza con el SDK real.'
      };
    },

    async verify({ template, capturedTemplate } = {}) {
      const match = Boolean(template && capturedTemplate && template === capturedTemplate);
      return {
        success: match,
        match,
        score: match ? 1 : 0,
        message: match
          ? 'Coincidencia válida en el adaptador externo.'
          : 'No se encontró coincidencia en el adaptador externo.'
      };
    },

    async getStatus() {
      return {
        connected: true,
        deviceId,
        status: 'ready',
        mode: 'external'
      };
    }
  };
}
