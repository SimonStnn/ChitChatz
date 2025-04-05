import $ from "jquery";

import { PORT, WS_URL, CLIENT_COOKIE_NAME, elements } from "@/const";
import state from "@/controller/state";
import { send } from "@/controller/websocket";

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
  if (!state.room) return;
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

elements.dialog.on("submit", (event) => {
  event.preventDefault();
  elements.dialog.prop("open", false);

  const form = event.target as HTMLFormElement;
  const input = $(form.elements.namedItem("username") as HTMLInputElement);
  if (!input) return console.error("Input not found");
  state.clientName = input.val() as string;

  state.setupWebSocket();
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

  state.clientName = decoded.name;
  state.setupWebSocket();
});

console.log("Script loaded");
