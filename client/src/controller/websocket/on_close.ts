import { WS_URL } from "@/const";
import state from "@/controller/state";

export default function on_ws_close(event: CloseEvent) {
  console.log("Disconnected from", WS_URL);
  const interval = setInterval(() => {
    if (state.ws.readyState === state.ws.CLOSED) state.setupWebSocket();
    else clearInterval(interval);
  }, 1000);

  if (state.refreshInterval) clearInterval(state.refreshInterval);
}
