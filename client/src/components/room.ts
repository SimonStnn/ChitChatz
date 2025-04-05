import { send } from "@/utils";

export default (room: string) => {
    const li = $("<li>").text(room);
    li.on("click", () => {
        if (room) send("leave_room");
        send("join_room", { room });
    });
    return li
}