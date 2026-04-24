import { Request } from 'express';
import { pool } from '../db/db.js';
import { SensorDataType } from '../types/index.js';
import { broadcast } from '../websocket/ws.js';

export const postSensorReadings = async (
  req: Request<unknown, unknown, SensorDataType>,
  res,
  next
) => {
  try {
    const { deviceId, temp, humidity, pressure, gas, airQuality } = req.body;

    const iaq = airQuality?.iaq;
    const confidence = airQuality?.confidence;
    const staticIaq = airQuality?.staticIaq;
    const VOC = airQuality?.VOC;
    const eCO2 = airQuality?.eCO2;

    const device = await pool.query(`SELECT room_id FROM devices WHERE id = $1`, [deviceId]);

    const roomId = device.rows[0].room_id;

    await pool.query(
      `INSERT INTO measurements 
     (time, device_id, room_id, temperature, humidity, pressure, gas, iaq, iaq_confidence, static_iaq, voc, eco2)
     VALUES (NOW(), $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
      [deviceId, roomId, temp, humidity, pressure, gas, iaq, confidence, staticIaq, VOC, eCO2]
    );
    console.log('📡 Incoming data:', {
      temp,
      humidity,
      pressure,
      gas,
      iaq,
      confidence,
      staticIaq,
      VOC,
      eCO2,
    });
    broadcast({ temp, humidity, pressure, gas, iaq, confidence, staticIaq, VOC, eCO2 });
    res.json({ status: 'sensor ok' });
  } catch (err) {
    next(err);
  }
};
