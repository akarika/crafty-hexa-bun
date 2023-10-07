import {MessageRepository} from "./message.repository.ts";
import {MessageEmptyError, MessageText, MessageTooLongError} from "./message.ts";

export type PostMessageCommand = { text: string; author: string; id: string }

export interface DateProvider {
    getNow(): Date;
}

export class PostMessageUseCase {

    constructor(private readonly messageRepository: MessageRepository, private readonly dateProvider: DateProvider) {
    }

    async handle(postingMessagesCommand: PostMessageCommand) {
        const messageText = MessageText.of(postingMessagesCommand.text)
        await this.messageRepository.save({
            id: postingMessagesCommand.id,
            text: messageText,
            author: postingMessagesCommand.author,
            publishedAt: this.dateProvider.getNow()
        })
    }
}