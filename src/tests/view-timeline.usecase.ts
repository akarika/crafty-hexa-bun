import {MessageRepository} from "../message.repository.ts";

export class ViewTimelineUseCase {
    constructor(private readonly messageRepository: MessageRepository) {
    }

    async handle({user}: { user: string }): Promise<{
        author: string,
        text: string,
        publicationTime: string
    }[]> {
        const messagesOfUser = await this.messageRepository.getAllOfUser(user)
        // methode ci dessous peut etre mise dans repository on CQRF  séparation command/queries
        messagesOfUser.sort((msA,msB)=>msB.publishedAt.getTime() - msA.publishedAt.getTime())
        return Promise.resolve([
            {
                author: messagesOfUser.at(0)?.author,
                text: messagesOfUser.at(0)?.text,
                publicationTime: "1 minute ago"
            }, {
                author: messagesOfUser.at(1)?.author,
                text: messagesOfUser.at(2)?.text,
                publicationTime: "15 minutes ago"
            }
        ])
    }
}