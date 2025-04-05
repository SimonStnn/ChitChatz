import $ from "jquery";

import { ClientMessage, ServerResponse } from "@/types";
import { PORT, WS_URL, CLIENT_COOKIE_NAME, elements } from "@/const";
import { send } from "@/utils";
import render_message from "@/components/message";
import render_room from "@/components/room";

let ws: WebSocket;
let jwt: string | null = null;
let rooms: string[] = [];
let room: string | null = null;
let clientName: string;
let refresh_interval: number | null = null;

function send<
  E extends ClientMessage["event"],
  D extends Omit<Extract<ClientMessage, { event: E }>, "event" | "jwt">
>(event: E, data: D = {} as D) {
  ws.send(
    JSON.stringify({
      event,
      ...data,
      jwt: jwt ? jwt : undefined,
    })
  );
  console.debug(">>>", event, data);
}

function update_room_status() {
  const in_room = room !== null;
  if (in_room) {
    console.info("You are in room:", room);
    elements.room.text(`You are in room: ${room}`);
  } else {
    console.info("You are not in a room");
    elements.room.text("You are not in a room");
  }

  // Disable elements
  elements.button_leave_room.prop("disabled", !in_room);
  elements.button_join_room.prop("disabled", in_room);
  elements.input_join_room.prop("disabled", in_room);
  elements.main_input.prop("disabled", !in_room);

  // Hide elements
  elements.button_leave_room.toggle(in_room);
  elements.button_join_room.toggle(!in_room);
  elements.input_join_room.toggle(!in_room);

  // Clear messages
  elements.messages.html("");
}

function on_ws_open(event: Event) {
  console.log("Connected to", WS_URL);
  elements.li_client.text("Client: " + clientName);
  send("register", { name: clientName });

  // refresh_interval = setInterval(() => {
  //   console.log("Refreshing JWT", jwt);
  // }, 1000);
}

function on_ws_message(event: MessageEvent) {
  try {
    const content = event.data.toString();
    const response: ServerResponse = JSON.parse(content);
    console.debug("<<<", response.event, response.data);

    if (response.jwt) {
      jwt = response.jwt;
      elements.li_jwt.text("JWT: " + jwt);

      const decoded = JSON.parse(atob(jwt.toString().split(".")[1]));
      console.log("Decoded JWT:", decoded);

      const expirationDate = new Date(decoded.exp * 1000);
      document.cookie = `${CLIENT_COOKIE_NAME}=${jwt}; expires=${expirationDate.toUTCString()}; path=/`;
    }

    switch (response.event) {
      case "register":
        send("get_room", {});
        send("get_rooms", {});
        break;
      case "room":
        room = response.data;
        update_room_status();

        const room_li = render_message("Server", `You are in room: ${room}`);
        elements.messages.append(room_li);
        // Scroll to bottom
        elements.messages.scrollTop(elements.messages[0].scrollHeight);
        break;
      case "rooms":
        console.info("Rooms:", response.data);
        elements.room_list.html("");
        for (const room of response.data) {
          elements.room_list.append(render_room(room));
        }
        break;
      case "message":
        const message_li = render_message(
          response.data.from,
          response.data.content
        );
        elements.messages.append(message_li);
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
}

function on_ws_close(event: CloseEvent) {
  console.log("Disconnected from", WS_URL);
  const interval = setInterval(() => {
    if (ws.readyState === ws.CLOSED) ws = new WebSocket(WS_URL);
    else clearInterval(interval);
  }, 1000);

  if (refresh_interval) clearInterval(refresh_interval);
}

function join_room() {
  const input = elements.input_join_room;
  if (input.val()) {
    send("join_room", { room: input.val() as string });
    input.val("");
  }
}

elements.button_join_room.on("click", join_room);
elements.input_join_room.on("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    join_room();
  }
});

elements.button_leave_room.on("click", () => {
  if (!room) return;
  send("leave_room", {});
});

elements.main_input.on("keydown", (event) => {
  if (event.key === "Enter") {
    const input = elements.main_input;
    if (input.val()) {
      send("message", { data: input.val() as string });
      input.val("");
    }
  }
});

function setup_ws() {
  ws = new WebSocket(WS_URL);
  ws.onopen = on_ws_open;
  ws.onmessage = on_ws_message;
  ws.onclose = on_ws_close;
}

elements.dialog.on("submit", (event) => {
  event.preventDefault();
  elements.dialog.prop("open", false);

  const form = event.target as HTMLFormElement;
  const input = $(form.elements.namedItem("username") as HTMLInputElement);
  if (!input) return console.error("Input not found");
  clientName = input.val() as string;

  setup_ws();
});

elements.button_sign_out.on("click", () => {
  document.cookie = `${CLIENT_COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
  window.location.reload();
});

$(() => {
  const jwt = document.cookie
    .split(";")
    .find((c) => c.startsWith(`${CLIENT_COOKIE_NAME}=`));
  if (!jwt) {
    elements.dialog.prop("open", true);
    return;
  }

  console.log("Found JWT in cookie:", jwt);
  const decoded = JSON.parse(atob(jwt.toString().split(".")[1]));
  console.log("Decoded JWT:", decoded);

  clientName = decoded.name;
  setup_ws();
});

console.log("Script loaded");
