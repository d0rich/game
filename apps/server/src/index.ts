import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({
  port: process.env.PORT ? Number(process.env.PORT) : 8080,
});

wss.on('connection', function connection(ws) {
  ws.on('error', console.error);

  ws.on('message', function message(data) {
    wss.clients.forEach((client) => {
      if (client !== ws) {
        client.send(data.toString());
      }
    });
  });
});
