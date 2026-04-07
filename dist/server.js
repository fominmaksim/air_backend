import 'dotenv/config';
import app from './app.js';
import { initWebSocket } from './websocket/ws.js';
const PORT = Number(process.env.PORT) || 3000;
const HOST = process.env.HOST || '';
const server = app.listen(PORT, HOST, () => {
    console.log(`Server running on host: ${HOST}; Port: ${PORT} [${process.env.NODE_ENV || 'development'}]`);
});
initWebSocket(server);
