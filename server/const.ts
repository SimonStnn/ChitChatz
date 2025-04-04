import { z } from "zod";

export const messageSchema = z.union([
  z
    .object({
      event: z.literal("register"),
      name: z.string(),
    })
    .strict(),
  z
    .object({
      event: z.literal("get_room"),
      jwt: z.string(),
    })
    .strict(),
  z
    .object({
      event: z.literal("get_rooms"),
      jwt: z.string(),
    })
    .strict(),
  z
    .object({
      event: z.literal("join_room"),
      room: z.string(),
      jwt: z.string(),
    })
    .strict(),
  z
    .object({
      event: z.literal("message"),
      data: z.string(),
      jwt: z.string(),
    })
    .strict(),
  z
    .object({
      event: z.literal("leave_room"),
      jwt: z.string(),
    })
    .strict(),
  z
    .object({
      event: z.literal("error"),
      data: z.array(z.string()),
      jwt: z.string(),
    })
    .strict(),
]);

type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

export type Message = z.infer<typeof messageSchema>;
export type MessageEvent = Message["event"];

export type Response = Prettify<
  { jwt?: string } & (
    | {
        event: "register";
        data: {};
      }
    | {
        event: "room";
        data: string | null;
      }
    | {
        event: "rooms";
        data: string[];
      }
    | {
        event: "message";
        data: {
          from: string;
          content: string;
        };
      }
    | {
        event: "error";
        data: string[];
      }
  )
>;
export type ResponseEvent = Response["event"];

export type Event = MessageEvent | ResponseEvent;

export const tokenSchema = z.object({
  name: z.string(),
  room: z.string().nullable(),
});
export type JwtPayload = z.infer<typeof tokenSchema>;
