import { Router } from 'express';
import { reassignDeviceRoom } from '../controllers/devices.js';

const router = Router();

router.post('/:id', reassignDeviceRoom);

export default router;
