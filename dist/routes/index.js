import { Router } from 'express';
import sensorReadingsRouter from './sensorReadings.js';
import devicesRouter from './devices.js';
const router = Router();
router.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
});
router.use('/sensor', sensorReadingsRouter);
router.use('/devices', devicesRouter);
router.use('/measurements', sensorReadingsRouter);
export default router;
