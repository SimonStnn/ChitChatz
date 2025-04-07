import { CLIENT_COOKIE_NAME, elements } from "@/const";
import { ServerResponse } from "@/types";
import render_message from "@/components/message";
import render_room, { update_room_status } from "@/components/room";
import { send } from "@/controller/websocket";
import state from "@/controller/state";

export default function on_ws_message(event: MessageEvent) {
  try {
    const content = event.data.toString();
    const response: ServerResponse = JSON.parse(content);
    console.debug("<<<", response.event, response.data);

    if (response.jwt) {
      state.jwt = response.jwt;

      const decoded = JSON.parse(atob(state.jwt.toString().split(".")[1]));

      const expirationDate = new Date(decoded.exp * 1000);
      document.cookie = `${CLIENT_COOKIE_NAME}=${
        state.jwt
      }; expires=${expirationDate.toUTCString()}; path=/; SameSite=Strict; Secure`;
    }

    switch (response.event) {
      case "register":
        send("get_room", {});
        send("get_rooms", {});
        break;
      case "room":
        state.room = response.data;
        update_room_status();

        const room_li = render_message(
          "Server",
          `You are in room: ${state.room}`
        );
        elements.messages.append(room_li);
        break;
      case "rooms":
        const legend = elements.room_list.find("legend");
        elements.room_list.empty();
        if (legend.length) elements.room_list.append(legend);
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
        // Scroll to bottom
        elements.messages.scrollTop(elements.messages[0].scrollHeight);
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
