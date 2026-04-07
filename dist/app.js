import express from 'express';
import cors from 'cors';
import router from './routes/index.js';
import { errorHandler } from './middleware/errorHandler.js';
import { pool } from './db/db.js';
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', router);
app.get('/test-db', async (req, res) => {
    const result = await pool.query('SELECT * FROM rooms');
    res.json(result.rows);
});
app.use(errorHandler);
export default app;
