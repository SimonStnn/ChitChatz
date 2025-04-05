import { elements } from "@/const";
import state from "@/controller/state";
import { send } from "@/controller/websocket";

export function update_room_status() {
  const in_room = state.room !== null;
  if (in_room) {
    console.info("You are in room:", state.room);
    elements.room.text(`You are in room: ${state.room}`);
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

export default (room: string) => {
  const li = $("<li>").text(room);

  if (state.room === room) li.addClass("current");

  li.on("click", () => {
    if (room) send("leave_room");
    send("join_room", { room });
  });
  return li;
};
