import { elements } from "@/const";
import state from "@/controller/state";
import { send } from "@/controller/websocket";

export function update_room_status() {
  const in_room = state.room !== null;
  if (in_room) {
    elements.room.text(state.room!);
  } else {
    elements.room.text("You are not in a room");
  }

  // Disable elements
  $("#leave-room").prop("disabled", !in_room);
  $("#join-room").prop("disabled", in_room || !$("#join-room-text").val());
  $("#join-room-text").prop("disabled", in_room);
  elements.main_input.prop("disabled", !in_room);

  // Hide elements
  $("#leave-room").toggle(in_room);
  $("#join-room").toggle(!in_room);
  $("#join-room-text").toggle(!in_room);

  // Clear messages
  elements.messages.html("");
}

export default (room: string) => {
  const li = $("<li>").text(room);

  if (state.room === room) li.addClass("current");

  li.on("click", () => {
    if (room) send("leave_room");
    send("join_room", { room });
  });
  return li;
};
