import {MessageRepository} from "../message.repository.ts";
import console from "console";
import {DateProvider} from "../post-message-use.case.ts";
const ONE_MINUTE_IN_MS = 60000

export class ViewTimelineUseCase {
    constructor(private readonly messageRepository: MessageRepository, private readonly dateProvider: DateProvider) {
    }

    async handle({user}: { user: string }): Promise<{
        author: string,
        text: string,
        publicationTime: string
    }[]> {
        const messagesOfUser = await this.messageRepository.getAllOfUser(user)
        // methode ci dessous peut etre mise dans repository on CQRF  séparation command/queries
        messagesOfUser.sort((msA, msB) => msB.publishedAt.getTime() - msA.publishedAt.getTime())

        /**
         * Tets de type Shift Gear Down , test de granlarité plus fin
         * on peut les supprimer
         */
        return messagesOfUser.map( (msg) => ({
            author: msg.author,
                text: msg.text,
                publicationTime: this.publicationTime(msg.publishedAt)
        }))
        /*return Promise.resolve([
            {
                author: messagesOfUser.at(0)?.author,
                text: messagesOfUser.at(0)?.text,
                publicationTime: this.publicationTime(now, messagesOfUser.at(0)?.publishedAt!)
            }, {
                author: messagesOfUser.at(1)?.author,
                text: messagesOfUser.at(1)?.text,
                publicationTime: this.publicationTime(now, messagesOfUser.at(0)?.publishedAt!)
            }
            , {
                author: messagesOfUser.at(2)?.author,
                text: messagesOfUser.at(2)?.text,
                publicationTime: this.publicationTime(now, messagesOfUser.at(0)?.publishedAt!)
            }
        ])*/
    }

    private publicationTime = (publishedAt: Date) => {
        const now = this.dateProvider.getNow()

        const diff = now.getTime() - publishedAt.getTime()
        console.log(diff)
        const minutes = diff / ONE_MINUTE_IN_MS
        console.log(minutes);
        if (minutes < 1) {
            return 'less than a minute ago'
        }
        if (minutes < 2) {
            return '1 minute ago'
        }
        return `${Math.round(minutes)} minutes ago`

    }
}