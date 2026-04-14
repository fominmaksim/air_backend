import { Router } from 'express';
import { getMeasurements } from '../controllers/measurements.js';

const router = Router();

router.get('/get', getMeasurements);

export default router;
