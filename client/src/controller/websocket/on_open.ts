import { elements, WS_URL } from "@/const";
import state from "@/controller/state";
import { send } from "@/controller/websocket";

export default function on_ws_open(event: Event) {
  console.log("Connected to", WS_URL);

  if (!state.clientName) {
    throw new Error("Client name is required");
  }
  elements.li_client.text("Client: " + state.clientName);
  send("register", { name: state.clientName });

  // refresh_interval = setInterval(() => {
  //   console.log("Refreshing JWT", jwt);
  // }, 1000);
}
