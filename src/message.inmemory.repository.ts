import {MessageRepository} from "./message.repository.ts";
import {Message} from "./message.ts";

export class InMemoryMessageRepository implements MessageRepository {
    messages = new Map<string, Message>();

    save(msg: Message): Promise<void> {
        this._save(msg)
        return Promise.resolve()
    }

    givenEixtingMessages(messages: Message[]) {
        messages.forEach(this._save.bind(this))
    }

    private _save(msg: Message) {
        this.messages.set(msg.id, msg)
    }

    getAllOfUser(user: string): Promise<Message[]> {
        return Promise.resolve([...this.messages.values()].filter(value => value.author === user));
    }
}