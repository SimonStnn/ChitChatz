export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

export type ClientMessage =
  | {
      event: "register";
      name: string;
    }
  | ({ jwt: string } & (
      | {
          event: "get_room";
        }
      | {
          event: "get_rooms";
        }
      | {
          event: "join_room";
          room: string;
        }
      | {
          event: "message";
          data: string;
        }
      | {
          event: "leave_room";
        }
      | {
          event: "error";
          data: string[];
        }
    ));

export type ClientMessageEvent = ClientMessage["event"];

export type ServerResponse =
  | {
      event: "register";
      data: {};
      jwt?: string;
    }
  | {
      event: "room";
      data: string | null;
      jwt?: string;
    }
  | {
      event: "rooms";
      data: string[];
      jwt?: string;
    }
  | {
      event: "message";
      data: {
        from: string;
        content: string;
      };
      jwt?: string;
    }
  | {
      event: "error";
      data: string[];
      jwt?: string;
    };

export type ResponseEvent = ServerResponse["event"];
