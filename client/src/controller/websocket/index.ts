import { WS_URL } from "@/const";
import on_ws_open from "./on_open";
import on_ws_message from "./on_message";
import on_ws_close from "./on_close";
import on_ws_error from "./on_error";

export { default as on_ws_close } from "./on_close";
export { default as on_ws_error } from "./on_error";
export { default as on_ws_message } from "./on_message";
export { default as on_ws_open } from "./on_open";
export { default as send } from "./send";

export function initWebsocket(): WebSocket {
  const ws = new WebSocket(WS_URL);
  ws.onopen = on_ws_open;
  ws.onmessage = on_ws_message;
  ws.onclose = on_ws_close;
  ws.onerror = on_ws_error;
  return ws;
}
