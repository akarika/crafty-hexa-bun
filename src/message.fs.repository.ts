import {MessageRepository} from "./message.repository.ts";
import {Message} from "./message.ts";
import * as Bun from "bun";
import * as Bun from "bun";
import {file} from "bun";

//adapter
export class FileSystemMessageRepository implements MessageRepository {
    #messagePath = Bun.file('message.json', {type: "application/json"});

    async save(msg: Message): Promise<void> {
        const messages = await this.#getMEssages()
        messages.push(msg)
        console.log(messages,"--------------");
        await Bun.write(this.#messagePath, JSON.stringify(messages));
        return Promise.resolve()
    }

    getAllOfUser(user: string): Promise<Message[]> {
        return Promise.resolve([]);
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
}