import { Message, MessageRepository } from "./post-message-use.case.ts";

export class InMemoryMessageRepository implements MessageRepository {
  message: Message;
  save(msg: Message): void {
    this.message = msg;
  }
}