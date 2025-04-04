export type Event = "open" | "message" | "error" | "close";

export type Message = {
  type: Event;
  data: Record<string, any>;
};
