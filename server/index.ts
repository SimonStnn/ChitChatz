import { WebSocket } from "ws";
import { ZodError } from "zod";
import log from "node-color-log";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

import {
  messageSchema,
  tokenSchema,
  type Response,
  type JwtPayload,
} from "./const";
dotenv.config();

const PORT = Number(process.env.PORT) || 8080;
const SECRET = process.env.SECRET || "";

if (!SECRET) {
  throw new Error("env SECRET is required");
  process.exit(1);
}

const server = new WebSocket.Server({ port: PORT });
log.info(`WebSocket server is running on ws://localhost:${PORT}`);

const unauthenticated_clients = new Set<WebSocket>();
const clients = new Set<WebSocket>();
const rooms = new Map<string, Set<WebSocket>>();

server.on("connection", (ws) => {
  clients.add(ws);

  function sendMessage<E extends Response["event"]>(
    event: E,
    data: Extract<Response, { event: E }>["data"],
    new_jwt?: string,
    ws_client: WebSocket = ws
  ) {
    const res = { event, data, jwt: new_jwt } as Response; //TODO: satisfies Response
    const message = JSON.stringify(res);
    ws_client.send(message);
    log.debug(">>>", message);
  }

  setTimeout(() => {
    if (clients.has(ws)) {
      if (unauthenticated_clients.has(ws)) unauthenticated_clients.delete(ws);
      return;
    }
    sendMessage("error", ["You are not registered"]);
    ws.close();
  }, 1000);

  ws.on("message", (data) => {
    try {
      const content = data.toString();
      log.debug("<<<", content);
      const parsedData = JSON.parse(content);
      const message = messageSchema.parse(parsedData);

      if (message.event === "register") {
        unauthenticated_clients.delete(ws);
        clients.add(ws);
        sendMessage(
          "register",
          {},
          jwt.sign({ name: message.name, room: null } as JwtPayload, SECRET)
        );
        return;
      }

      const payload = tokenSchema.parse(jwt.verify(message.jwt, SECRET));

      switch (message.event) {
        case "get_room":
          if (!payload.room) {
            sendMessage("error", ["You are not in a room"]);
            return;
          }
          sendMessage("room", payload.room);
          break;
        case "get_rooms":
          sendMessage("rooms", Array.from(rooms.keys()));
          break;
        case "join_room":
          if (payload.room) {
            sendMessage("error", ["You are already in a room"]);
            return;
          }
          const room = message.room;
          if (!rooms.has(room)) {
            rooms.set(room, new Set());
          }
          rooms.get(room)?.add(ws);
          sendMessage(
            "register",
            {},
            jwt.sign({ name: payload.name, room } as JwtPayload, SECRET)
          );
          log.info(`--- Client ${payload.name} registered to room ${room}`);
          break;
        case "message":
          if (!payload.room) {
            sendMessage("error", ["You are not in a room"]);
            return;
          }
          const room_clients = rooms.get(payload.room);
          if (!room_clients) {
            sendMessage("error", ["Room not found"]);
            return;
          }
          for (const client of room_clients) {
            if (client !== ws) {
              sendMessage(
                "message",
                {
                  from: payload.name,
                  content: message.data,
                },
                undefined,
                client
              );
            }
          }
          break;
        case "leave_room":
          if (!payload.room) {
            sendMessage("error", ["You are not in a room"]);
            return;
          }
          rooms.get(payload.room)?.delete(ws);
          if (rooms.get(payload.room)?.size === 0) {
            rooms.delete(payload.room);
            log.debug(`--- Room ${payload.room} deleted`);
          }
          sendMessage(
            "register",
            {},
            jwt.sign({ name: payload.name, room: null } as JwtPayload, SECRET)
          );
          log.info(`--- Client ${payload.name} left room ${payload.room}`);
          break;
        case "error":
          sendMessage("error", ["Ok bye"]);

          // Remove the client from the clients and rooms
          clients.delete(ws);
          for (const room of rooms.values()) {
            room.delete(ws);

            ws.close();
            break;
          }
      }
    } catch (e) {
      if (e instanceof ZodError) {
        sendMessage(
          "error",
          e.errors.map((error) => error.message)
        );
      }
      ws.close();
    }
  });

  ws.on("close", () => {
    log.info("--- Client disconnected");
    unauthenticated_clients.delete(ws);
    clients.delete(ws);
    for (const [room_key, room] of rooms) {
      room.delete(ws);
      if (room.size === 0) {
        rooms.delete(room_key);
        log.debug(`--- Room ${room} deleted`);
      }
    }
  });
});
