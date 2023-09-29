import {MessageRepository} from "./message.repository.ts";

export type PostMessageCommand = { text: string; author: string; id: string }

export interface DateProvider {
    getNow(): Date
}

export class MessageTooLongError extends Error {
}
export class MessageEmptyError extends Error {
}

export class PostMessageUseCase {

    constructor(private readonly messageRepository: MessageRepository, private readonly dateProvider: DateProvider) {
    }

    async handle(postingMessagesCommand: PostMessageCommand) {
        if (postingMessagesCommand.text.length > 280) throw new MessageTooLongError()
        if(postingMessagesCommand.text.trim().length === 0 ) throw new MessageEmptyError()
        await this.messageRepository.save({
            id: postingMessagesCommand.id,
            text: postingMessagesCommand.text,
            author: postingMessagesCommand.author,
            publishedAt: this.dateProvider.getNow()
        })
    }
}