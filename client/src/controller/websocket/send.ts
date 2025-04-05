import { ClientMessage } from "@/types";
import state from "@/controller/state";

export default function send<
  E extends ClientMessage["event"],
  D extends Omit<Extract<ClientMessage, { event: E }>, "event" | "jwt">
>(event: E, data: D = {} as D) {
  state.ws.send(
    JSON.stringify({
      event,
      ...data,
      jwt: state.jwt ? state.jwt : undefined,
    })
  );
  console.debug(">>>", event, data);
}
