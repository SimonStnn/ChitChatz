import { WS_URL } from "@/const";
import state from "@/controller/state";

export default function on_ws_close(event: CloseEvent) {
  console.warn("Disconnected from", WS_URL);
  // setTimeout(() => {
  //   if (state.ws.readyState === state.ws.CLOSED) window.location.reload();
  // }, 1000);

  if (state.refreshInterval) clearInterval(state.refreshInterval);
}
