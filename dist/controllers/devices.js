import { pool } from '../db/db.js';
export const reassignDeviceRoom = async (req, res, next) => {
    try {
        const { newRoomId } = req.body;
        const { deviceId } = req.params;
        await pool.query(`UPDATE devices SET room_id = $1 WHERE id = $2`, [newRoomId, deviceId]);
        res.sendStatus(200);
        console.log('room updated successfully');
    }
    catch (err) {
        next(err);
    }
};
