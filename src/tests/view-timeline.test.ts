import {beforeEach, describe, expect, setSystemTime, test} from "bun:test";
import {ViewTimelineUseCase} from "./view-timeline.usecase.ts";
import {InMemoryMessageRepository} from "../message.inmemory.repository.ts";

import {Message} from "../message.ts";
import console from "console";
import {StubDateProvider} from "../../stub-date-provider.ts";

describe('Feature: Viewing a personnal timeline', () => {
    let fixture: Fixture
    beforeEach(() => {
        fixture = createFixture()
    })
    describe('Rule: Messages are shon in reverse chrnonological order', () => {
        test('Alice can view the 3 messages she published in her timeline', () => {
            async () => {
                fixture.givenTheFollowinfMessages([{
                    id: 'message-1',
                    author: 'Alice',
                    text: 'Hello I m Alice',
                    publishedAt: new Date('2023-09-29T22:55:00.000Z')
                }, {
                    id: 'message-2',
                    author: 'Bob',
                    text: 'Hello I m BOB',
                    publishedAt: new Date('2023-09-29T22:58:00.000Z')
                }, {
                    id: 'message-3',
                    author: 'Alice',
                    text: 'Bryan is In the kitchen',
                    publishedAt: new Date('2023-09-29T23:05:00.000Z')
                },
                    {
                        id: 'message-4',
                        author: 'Alice',
                        text: 'My last mesage',
                        publishedAt: new Date('2023-09-29T23:05:30.000Z')
                    }])
                fixture.givenNowIs(new Date('2023-09-29T23:05:00.000Z'))
                await fixture.whenUserSeesTheTimelineOf('Alice')
                fixture.thenUserShouldSee([
                    {
                        author: 'Alice',
                        text: 'My last mesage',
                        publicationTime: "less than a minute ago"
                    },
                    {
                        author: 'Alice',
                        text: 'Bryan is In the kitchen',
                        publicationTime: "1 minute ago"
                    },
                    {
                        author: 'Alice',
                        text: 'Hello I m Alice',
                        publicationTime: "15 minutes ago"
                    },
                ])
            }
        })
    })
    const pulicationTime = (now: Date, publishedAt: Date) => {
        const diff = now.getTime() - publishedAt.getTime()
        console.log(diff)
        const minutes = diff / 60000
        console.log(minutes);
        if (minutes < 1) {
            return 'less than a minute ago'
        }
        if (minutes < 2) {
            return '1 minute ago'
        }
        return `${Math.round(minutes)} minutes ago`

    }
    /**
     * Tets de type Shift Gear Down ,descendre de vitesse pour granlarité plus finne
     * on peut les supprimer
     */
    describe('pulication time', () => {
        setSystemTime(new Date("2023-10-01T10:10:00.000Z"));
        test("should return 'less tha a minute ago' when publication < 1 min ag", () => {
            const publishedAt = new Date('2023-10-01T10:09:01.000Z')
            const text = pulicationTime(new Date(), publishedAt)

            expect(text).toEqual('less than a minute ago')
        });
        test("should return '1 minute ago' when publication is exactly under 2 minutes ago", () => {
            const publishedAt = new Date('2023-10-01T10:08:01.000Z')
            const text = pulicationTime(new Date(), publishedAt)
            expect(text).toEqual('1 minute ago')
        });
        test("should return '2 minute ago' when publication date is between 2 minutes ans 2 min59 ago", () => {
            const publishedAt = new Date('2023-10-01T10:07:59.000Z')
            const text = pulicationTime(new Date(), publishedAt)
            expect(text).toEqual('2 minutes ago')
        });
        test("should return '5 minute ago' when publicationdate is exactly betwwen X minutes and X minutes 59 s ago", () => {
            const publishedAt = new Date('2023-10-01T10:04:59.000Z')
            const text = pulicationTime(new Date(), publishedAt)
            expect(text).toEqual('5 minutes ago')
        });
    })
})
const createFixture = () => {
    let timeline: {
        author: string,
        text: string,
        publicationTime: string
    }[]
    let message: Message
    let now: Date
    const messageRepository = new InMemoryMessageRepository()
    const stubDateProvier = new StubDateProvider()
    const viewTimelineUseCase = new ViewTimelineUseCase(messageRepository, stubDateProvier)
    return {
        givenTheFollowinfMessages(messsages: Message[]) {
            messageRepository.givenEixtingMessages(messsages)
        },
        givenNowIs(now: Date) {
            stubDateProvier.now = now
        },
        async whenUserSeesTheTimelineOf(user: string) {
            timeline = await viewTimelineUseCase.handle({user})
        },
        thenUserShouldSee(expectedTimeline: {
            author: string,
            text: string,
            publicationTime: string
        }[]) {
            expect(timeline).toEqual(expectedTimeline)
        }
    }
}
type Fixture = ReturnType<typeof createFixture>