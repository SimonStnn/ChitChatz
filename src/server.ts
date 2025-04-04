import { WebSocket } from "ws";
import { type Message } from "./types";

const server = new WebSocket.Server({ port: 8080 });

server.on("connection", (ws) => {
  console.log("Client connected");
});

server.on("message", (data) => {
  const message: Message = JSON.parse(data.toString());
  console.debug("<<<", message);

  switch (message.type) {
    case "open":
      console.log(`Client name: ${message.data.name}`);
      break;
    case "message":
      console.log(`Temperature: ${message.data.temp_C}°C`);
      break;
    case "close":
      console.log("Client disconnected");
      break;
  }
});

server.on("close", () => {
  console.log("Client disconnected");
});
