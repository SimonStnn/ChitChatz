import readline from "readline";
import { WebSocket } from "ws";
import { z } from "zod";
import log from "node-color-log";
import dotenv from "dotenv";
dotenv.config();

const PORT = Number(process.env.PORT) || 8080;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: "> ",
});

const WS_URL = `ws://localhost:${PORT}`;
const ws = new WebSocket(WS_URL);

const HELP_MESSAGE = `
Commands: room, rooms, join <room>, leave, message <content>
To send a command, prepend with &`;

console.log("------");
console.log("Welcome to the chat!");
console.log(HELP_MESSAGE);
console.log("------");

log.setLevel("info");

const name = process.argv[2];
log.info(`Name: ${name}`);

type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

type Message =
  | {
      event: "register";
      name: string;
    }
  | ({ jwt: string } & (
      | {
          event: "get_room";
        }
      | {
          event: "get_rooms";
        }
      | {
          event: "join_room";
          room: string;
        }
      | {
          event: "message";
          data: string;
        }
      | {
          event: "leave_room";
        }
      | {
          event: "error";
          data: string[];
        }
    ));

type MessageEvent = Message["event"];

const responseSchema = z.union([
  z.object({
    event: z.literal("register"),
    data: z.object({}),
    jwt: z.string().optional(),
  }),
  z.object({
    event: z.literal("room"),
    data: z.string(),
    jwt: z.string().optional(),
  }),
  z.object({
    event: z.literal("rooms"),
    data: z.array(z.string()),
    jwt: z.string().optional(),
  }),
  z.object({
    event: z.literal("message"),
    data: z.object({
      from: z.string(),
      content: z.string(),
    }),
    jwt: z.string().optional(),
  }),
  z.object({
    event: z.literal("error"),
    data: z.array(z.string()),
    jwt: z.string().optional(),
  }),
]);

type Response = z.infer<typeof responseSchema>;
type ResponseEvent = Response["event"];

let jwt: string | null = null;
let rooms: string[] = [];
let room: string | null = null;

function send<
  E extends Message["event"],
  D extends Omit<Extract<Message, { event: E }>, "event" | "jwt">
>(event: E, data: D) {
  if (!jwt) {
    log.error("Not authenticated");
    return;
  }

  ws.send(
    JSON.stringify({
      event,
      ...data,
      jwt,
    })
  );
  log.debug(">>>", event, data);
}

ws.on("open", () => {
  log.debug("Authenticating to", WS_URL, "as", name);

  ws.send(
    JSON.stringify({
      event: "register",
      name,
    } satisfies Message)
  );
});

ws.on("message", (data) => {
  try {
    const content = data.toString();
    log.debug("<<<", content);
    const parsedData = JSON.parse(content);
    const response = responseSchema.parse(parsedData);

    if (response.jwt) {
      jwt = response.jwt;
    }

    switch (response.event) {
      case "register":
        break;
      case "room":
        console.log("You are in room:", response.data);
        break;
      case "rooms":
        console.log("Rooms:", response.data);
        break;
      case "message":
        console.log(`${response.data.from}: ${response.data.content}`);
        break;
      case "error":
        console.error("Error:", response.data);
        break;
      default:
        console.error("Unknown event", (response as any).event);
        break;
    }
  } catch (error) {
    console.error("Error parsing response:", error);
  }
});

rl.on("line", (input) => {
  if (!input) return;
  if (input.startsWith("&")) {
    const command = input.slice(1).split(" ")[0];
    const content = input.slice(1).split(" ").slice(1).join(" ");
    switch (command) {
      case "help":
        console.log(HELP_MESSAGE);
        break;
      case "room":
        send("get_room", {});
        break;
      case "rooms":
        send("get_rooms", {});
        break;
      case "join":
        send("join_room", { room: content });
        room = content;
        break;
      case "leave":
        send("leave_room", {});
        break;
      case "message":
        send("message", { data: content });
        break;
      default:
        console.error("Unknown command:", command);
    }
    return;
  }
  send("message", { data: input });
});
