import { broadcast } from '../websocket/ws.js';

export const postSensorReadings = async (req, res, next) => {
  try {
    const data = req.body;
    console.log('📡 Incoming data:', data);
    broadcast(data);
    res.json({ status: 'sensor ok' });
  } catch (err) {
    next(err);
  }
};
