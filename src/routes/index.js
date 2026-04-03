import { Router } from 'express';
import sensorReadingsRouter from './sensorReadings.js';

const router = Router();

router.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

router.use('/sensor', sensorReadingsRouter);

export default router;
