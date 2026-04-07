import { Router } from 'express';
import { postSensorReadings } from '../controllers/sensorReadings.js';
const router = Router();
router.post('/', postSensorReadings);
export default router;
