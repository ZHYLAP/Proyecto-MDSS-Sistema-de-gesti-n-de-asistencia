export default async function createBiometricAdapter({ deviceId, timeoutMs }) {
  return {
    async connect() {
      return {
        connected: true,
        deviceId,
        status: 'ready',
        mode: 'external',
        message: 'Listo para usar el SDK o driver de tu lector.'
      };
    },

    async capture() {
      return {
        success: true,
        deviceId,
        timeoutMs,
        template: 'external-template',
        quality: 100,
        message: 'Captura realizada por el adaptador externo.'
      };
    },

    async verify({ template, capturedTemplate }) {
      return {
        success: true,
        match: template === capturedTemplate,
        score: template === capturedTemplate ? 1 : 0,
        message: 'Verificación realizada por el adaptador externo.'
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
