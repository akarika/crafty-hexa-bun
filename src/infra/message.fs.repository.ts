import {MessageRepository} from "../application/message.repository.ts";
import {Message} from "../domaine/message.ts";
import * as Bun from "bun";

//adapter implémentation de MessageRepository
export class FileSystemMessageRepository implements MessageRepository {
    #messagePath = Bun.file('message.json', {type: "application/json"});

    async save(message: Message): Promise<void> {
        const messages = await this.#getMEssages();
        const existingMessageIndex = messages.findIndex(
            (msg) => msg.id === message.id
        );
        if (existingMessageIndex === -1) {
            messages.push(message);
        } else {
            messages[existingMessageIndex] = message;
        }
        await Bun.write(this.#messagePath, JSON.stringify(messages));
        return Promise.resolve()
    }


    async #getMEssages(): Promise<Message[]> {
        const data = this.#messagePath
        const messages = await data.json<{
            id: string;
            author: string;
            text: string;
            publishedAt: string;
        }[]>()
        return messages.map((m) => ({
            id: m.id,
            author: m.author,
            text: m.text,
            publishedAt: new Date(m.publishedAt)
        }))
    }

    async getById(messageId: string): Promise<Message> {
        const allMessages = await this.#getMEssages();

        return allMessages.filter((msg) => msg.id === messageId)[0];
    }

    async getAllOfUser(user: string): Promise<Message[]> {
        const messages = await this.#getMEssages();

        return messages.filter((m) => m.author === user);
    }
}