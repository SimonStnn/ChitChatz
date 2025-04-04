import { WebSocket } from "ws";
import { type Message } from "./types";

const WS_URL = "ws://localhost:8080";
const ws = new WebSocket(WS_URL);

const name = process.argv[2];
console.log(`Name: ${name}`);

function sendMessage(message: Message) {
  const data = JSON.stringify(message);
  ws.send(data);
  console.debug(">>>", message);
}

ws.on("open", async () => {
  console.log("Connected to server", WS_URL);

  // Open message
  sendMessage({
    type: "open",
    data: {
      name,
    },
  });

  for (let i = 0; i < 3; i++) {
    const temp_C = Math.floor(Math.random() * 100);
    const temp_F = (temp_C * 9) / 5 + 32;

    sendMessage({
      type: "message",
      data: {
        temp_C,
        temp_F,
      },
    });
    await new Promise((resolve) => setTimeout(resolve, 5000));
  }
  sendMessage({
    type: "close",
    data: {},
  });
  ws.close();
});

ws.on("message", (data) => {
  const message = JSON.parse(data.toString());
  console.debug("<<<", message);
});

ws.on("close", () => {
  console.log("Disconnected from server");
});
