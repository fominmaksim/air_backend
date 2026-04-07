import { WebSocketServer } from 'ws';
let clients = [];
export const initWebSocket = server => {
    const wss = new WebSocketServer({ server, path: '/ws' });
    wss.on('connection', (ws, req) => {
        console.log('Client connected, req:', req);
        clients.push(ws);
        wss.on('message', msg => {
            console.log('📩 from client:', msg.toString());
        });
        ws.on('close', () => {
            clients = clients.filter(c => c !== ws);
        });
    });
};
export const broadcast = data => {
    clients.forEach(client => {
        if (client.readyState === 1) {
            client.send(JSON.stringify(data));
        }
    });
};
