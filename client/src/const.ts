export const PORT = 8080;
export const WS_URL = `ws://localhost:${PORT}`;
export const CLIENT_COOKIE_NAME = "jwt";

export const elements = {
  // aside
  room: $("#room"),
  room_list: $("#rooms"),
  input_join_room: $("#join-room-text"),
  button_leave_room: $("#leave-room"),
  button_join_room: $("#join-room"),
  // main
  messages: $("#messages"),
  main_input: $("#main-input"),
  // footer
  li_jwt: $("#jwt"),
  li_client: $("#client-name"),
  button_sign_out: $("#sign-out"),
  // dialog
  dialog: $("#username-dialog"),
};
