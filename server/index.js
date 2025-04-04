"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const zod_1 = require("zod");
const node_color_log_1 = __importDefault(require("node-color-log"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const const_1 = require("./const");
dotenv_1.default.config();
const PORT = Number(process.env.PORT) || 8080;
const SECRET = process.env.SECRET || "";
if (!SECRET) {
    throw new Error("env SECRET is required");
    process.exit(1);
}
node_color_log_1.default.setLevel("debug");
const server = new ws_1.WebSocket.Server({ port: PORT });
node_color_log_1.default.info(`WebSocket server is running on ws://localhost:${PORT}`);
const unauthenticated_clients = new Set();
const clients = new Set();
const rooms = new Map();
server.on("connection", (ws) => {
    clients.add(ws);
    function sendMessage(event, data, new_jwt, ws_client = ws) {
        if (new_jwt && typeof new_jwt === "object")
            new_jwt = signJWT(new_jwt);
        const res = { event, data, jwt: new_jwt }; //TODO: satisfies Response
        const message = JSON.stringify(res);
        ws_client.send(message);
        node_color_log_1.default.debug(">>>", message);
    }
    function signJWT(payload) {
        return jsonwebtoken_1.default.sign(payload, SECRET, {
            expiresIn: "1h",
        });
    }
    setTimeout(() => {
        if (clients.has(ws)) {
            if (unauthenticated_clients.has(ws))
                unauthenticated_clients.delete(ws);
            return;
        }
        sendMessage("error", ["You are not registered"]);
        ws.close();
    }, 1000);
    ws.on("message", (data) => {
        try {
            const content = data.toString();
            node_color_log_1.default.debug("<<<", content);
            const parsedData = JSON.parse(content);
            const message = const_1.messageSchema.parse(parsedData);
            if (message.event === "register") {
                node_color_log_1.default.debug("--- Registering", message.name);
                unauthenticated_clients.delete(ws);
                clients.add(ws);
                sendMessage("register", {}, signJWT({ name: message.name, room: null }));
                return;
            }
            const payload = const_1.tokenSchema.parse(jsonwebtoken_1.default.verify(message.jwt, SECRET));
            switch (message.event) {
                case "get_room":
                    sendMessage("room", payload.room);
                    break;
                case "get_rooms":
                    sendMessage("rooms", Array.from(rooms.keys()));
                    break;
                case "join_room":
                    if (payload.room) {
                        // Leave the current room
                        rooms.get(payload.room)?.delete(ws);
                    }
                    const room = message.room;
                    // Create the room if it doesn't exist
                    if (!rooms.has(room)) {
                        rooms.set(room, new Set());
                        for (const client of clients) {
                            sendMessage("rooms", Array.from(rooms.keys()), undefined, client);
                        }
                    }
                    // Add the client to the room
                    rooms.get(room)?.add(ws);
                    sendMessage("register", {}, signJWT({ name: payload.name, room }));
                    node_color_log_1.default.info(`--- Client ${payload.name} registered to room ${room}`);
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
                        sendMessage("message", {
                            from: payload.name,
                            content: message.data,
                        }, client === ws ? signJWT(payload) : undefined, client);
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
                        node_color_log_1.default.debug(`--- Room ${payload.room} deleted`);
                        for (const client of clients) {
                            sendMessage("rooms", Array.from(rooms.keys()), undefined, client);
                        }
                    }
                    sendMessage("register", {}, signJWT({ name: payload.name, room: null }));
                    node_color_log_1.default.info(`--- Client ${payload.name} left room ${payload.room}`);
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
        }
        catch (e) {
            if (e instanceof zod_1.ZodError) {
                sendMessage("error", e.errors.map((error) => error.message));
            }
            ws.close();
        }
    });
    ws.on("close", () => {
        node_color_log_1.default.info("--- Client disconnected");
        unauthenticated_clients.delete(ws);
        clients.delete(ws);
        for (const [room_key, room] of rooms) {
            room.delete(ws);
            if (room.size === 0) {
                rooms.delete(room_key);
                node_color_log_1.default.debug(`--- Room ${room} deleted`);
            }
        }
    });
});
