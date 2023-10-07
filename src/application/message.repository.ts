import {Message} from "../domaine/message.ts";

export interface MessageRepository {
    save(msg: Message): Promise<void>
    getById(messageId: string): Promise<Message>;
    getAllOfUser(user: string): Promise<Message[]>
}