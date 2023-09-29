import {Message} from "./message.ts";

export interface MessageRepository {
    save(msg: Message): Promise<void>

    getAllOfUser(user: string): Promise<Message[]>
}