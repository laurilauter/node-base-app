const portws = process.env.PORTWS || 5000;
import http from "http";
import { WebSocketServer } from "ws";
// const wss = new WebSocketServer({ port: 4040 });

//import WebSocket from "ws";

const server = http.createServer();
const wss = new WebSocketServer({ server });
//const wss = new WebSocketServer({ server: server }, function () {});

//server.listen(4040);
console.log(portws);

server.listen(portws, () => {
  console.log(`ws listening on ${portws}`);
});

wss.on("connection", function connection(ws) {
  ws.on("error", console.error);

  ws.on("message", function message(data, isBinary) {
    console.log("Server received a message");
    wss.clients.forEach(function (client) {
      console.log("in for each");
      console.log("client._readyState", client._readyState);
      client.send(data, { binary: isBinary });
    });
  });

  ws.send("something from server");
});
