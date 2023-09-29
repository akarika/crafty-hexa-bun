import {MessageRepository} from "./message.repository.ts";
import {Message} from "./message.ts";

export class FileSystemMessageRepository implements MessageRepository{
    save(msg: Message): Promise<void> {
        const file = Bun.file('message.json',{ type: "application/json" });
        Bun.write(file,JSON.stringify(msg));
        return Promise.resolve()
    }

}