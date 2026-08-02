import express from 'express';
import { createBiometricService } from '../services/biometric.js';

const router = express.Router();

router.get('/biometric/status', async (req, res) => {
  try {
    const service = await createBiometricService();
    const status = await service.getDeviceStatus();
    return res.json({ success: true, data: status });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/biometric/capture', async (req, res) => {
  try {
    const service = await createBiometricService();
    const result = await service.captureFingerprint(req.body || {});
    return res.json({ success: true, data: result });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/biometric/verify', async (req, res) => {
  try {
    const service = await createBiometricService();
    const result = await service.verifyFingerprint(req.body || {});
    return res.json({ success: true, data: result });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
