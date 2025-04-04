"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokenSchema = exports.messageSchema = void 0;
const zod_1 = require("zod");
exports.messageSchema = zod_1.z.union([
    zod_1.z
        .object({
        event: zod_1.z.literal("register"),
        name: zod_1.z.string(),
    })
        .strict(),
    zod_1.z
        .object({
        event: zod_1.z.literal("get_room"),
        jwt: zod_1.z.string(),
    })
        .strict(),
    zod_1.z
        .object({
        event: zod_1.z.literal("get_rooms"),
        jwt: zod_1.z.string(),
    })
        .strict(),
    zod_1.z
        .object({
        event: zod_1.z.literal("join_room"),
        room: zod_1.z.string(),
        jwt: zod_1.z.string(),
    })
        .strict(),
    zod_1.z
        .object({
        event: zod_1.z.literal("message"),
        data: zod_1.z.string(),
        jwt: zod_1.z.string(),
    })
        .strict(),
    zod_1.z
        .object({
        event: zod_1.z.literal("leave_room"),
        jwt: zod_1.z.string(),
    })
        .strict(),
    zod_1.z
        .object({
        event: zod_1.z.literal("error"),
        data: zod_1.z.array(zod_1.z.string()),
        jwt: zod_1.z.string(),
    })
        .strict(),
]);
exports.tokenSchema = zod_1.z.object({
    name: zod_1.z.string(),
    room: zod_1.z.string().nullable(),
});
