import $ from "jquery";

import { CLIENT_COOKIE_NAME, elements } from "@/const";
import state from "@/controller/state";
import { send } from "@/controller/websocket";

function join_room() {
  const input = $("#join-room-text");
  if (input.val()) {
    send("join_room", { room: input.val() as string });
    input.val("");
  }
}

$("#join-room").on("click", join_room);
$("#join-room-text").on("keydown", (event) => {
  $("#join-room").prop(
    "disabled",
    // Disable button IF:
    !(
      // textbox is empty
      (
        $("#join-room-text").val() +
        // Take the new character into account but exclude complex keys
        // (e.g. Shift, Ctrl, Alt, etc.)
        (event.key.length === 1 ? event.key : "")
      )
    ) ||
      // OR pressed key is backspace AND textbox length is 1
      (event.key === "Backspace" &&
        String($("#join-room-text").val())?.length === 1)
  );
  if (event.key === "Enter") {
    event.preventDefault();
    join_room();
  }
});

$("#leave-room").on("click", () => {
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

$("#username-dialog").on("submit", (event) => {
  event.preventDefault();
  $("#username-dialog").prop("open", false);

  const form = event.target as HTMLFormElement;
  const input = $(form.elements.namedItem("username") as HTMLInputElement);
  if (!input) return console.error("Input not found");
  state.clientName = input.val() as string;

  state.setupWebSocket();
});

$("#sign-out").on("click", () => {
  document.cookie = `${CLIENT_COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  window.location.reload();
});

$("#info-button").on("click", () => {
  $("#info-dialog").prop("open", true);
});

$("#customize-button").on("click", () => {
  $("#customize-dialog").prop("open", true);
});

$("#customize-border-radius").on("input", (event) => {
  const value = (event.target as HTMLInputElement).value;
  $("#customize-border-radius-value").text(value);
  // store in local storage
  localStorage.setItem("border-radius", value);
  document.documentElement.style.setProperty("--radius", `${value}px`);
});
$(() => {
  // set border radius from local storage
  const borderRadius = localStorage.getItem("border-radius");
  if (borderRadius) {
    document.documentElement.style.setProperty("--radius", `${borderRadius}px`);
  }
  $("#customize-border-radius").val(borderRadius || 0);
  $("#customize-border-radius-value").text(borderRadius || 0);
});

$(() => {
  const jwt = document.cookie
    .split(";")
    .find((c) => c.startsWith(`${CLIENT_COOKIE_NAME}=`));
  if (!jwt) {
    $("#username-dialog").prop("open", true);
    return;
  }

  const decoded = JSON.parse(atob(jwt.toString().split(".")[1]));
  state.clientName = decoded.name;
  state.setupWebSocket();
});

console.info("Script loaded");
