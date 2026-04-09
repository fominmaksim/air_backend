import { WebSocketServer } from 'ws';

let clients = [];

export const initWebSocket = server => {
  const wss = new WebSocketServer({ server, path: '/ws' });

  wss.on('connection', (ws, req) => {
    console.log('WS client connected:', req.socket.remoteAddress);
    clients.push(ws);

    ws.on('message', msg => {
      console.log('📩 from client:', msg.toString());
    });

    ws.on('close', () => {
      clients = clients.filter(c => c !== ws);
      console.log('WS client disconnected');
    });

    ws.on('error', err => {
      console.log('WS client error:', err.message);
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
