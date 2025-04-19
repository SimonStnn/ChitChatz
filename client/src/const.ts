export const PORT = 3000;
export const WS_URL = `ws://${window.location.host}:${PORT}`;
export const CLIENT_COOKIE_NAME = "jwt";

export const elements = {
  // aside
  room: $("#room"),
  room_list: $("#rooms"),
  // main
  messages: $("#messages"),
  main_input: $("#main-input"),
};
