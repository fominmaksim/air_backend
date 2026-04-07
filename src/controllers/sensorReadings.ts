import { pool } from '../db/db.js';
import { broadcast } from '../websocket/ws.js';

export const postSensorReadings = async (req, res, next) => {
  try {
    const deviceId = req.body.deviceId || 2;
    const { temp, humidity, pressure, gas } = req.body;

    const device = await pool.query(`SELECT room_id FROM devices WHERE id = $1`, [deviceId]);

    const roomId = device.rows[0].room_id;

    await pool.query(
      `INSERT INTO measurements 
     (time, device_id, room_id, temperature, humidity, pressure, gas)
     VALUES (NOW(), $1, $2, $3, $4, $5, $6)`,
      [deviceId, roomId, temp, humidity, pressure, gas]
    );
    console.log('📡 Incoming data:', { temp, humidity, pressure, gas });
    broadcast({ temp, humidity, pressure, gas });
    res.json({ status: 'sensor ok' });
  } catch (err) {
    next(err);
  }
};
