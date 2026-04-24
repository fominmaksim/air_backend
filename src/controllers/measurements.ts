import { pool } from '../db/db.js';

export const getMeasurements = async (req, res, next) => {
  try {
    const { deviceId } = req.query;

    // const parsedInterval = interval || '6 hours';
    const parsedDeviceId = deviceId || 2;
    // const hours = interval === '1h' ? 1 : interval === '24h' ? 24 : 6;

    const data = await pool.query(
      `SELECT 
    to_timestamp(floor(extract(epoch from time) / 600) * 600) AS bucket,     
    AVG(temperature) as temp,
    AVG(humidity) as humidity,
    AVG(pressure) as pressure,
    AVG(gas) as gas,
    AVG(static_iaq) AS "staticIaq",
    AVG(voc) AS "VOC",
    AVG(eco2) AS "eCO2"
  FROM measurements
  WHERE device_id = $1
    AND time >= NOW() - INTERVAL '12 hours'
  GROUP BY bucket
  ORDER BY bucket`,
      [parsedDeviceId]
    ); // 10 min avg

    res.json(data.rows);
  } catch (err) {
    next(err);
  }
};
