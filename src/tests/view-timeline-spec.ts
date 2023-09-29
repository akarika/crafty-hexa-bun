import {beforeEach, describe, expect, test} from "bun:test";
import {ViewTimelineUseCase} from "./view-timeline.usecase.ts";
import {InMemoryMessageRepository} from "../message.inmemory.repository.ts";

import {Message} from "../message.ts";

describe('Feature: Viewing a personnal timeline', () => {
    let fixture: Fixture
    beforeEach(() => {
        fixture = createFixture()
    })
    describe('Rule: Messages are shon in reverse chrnonological order', () => {
        test('Alice can view the 2 messages she published in her timeline', () => {
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
                    id: 'message-2',
                    author: 'Alice',
                    text: 'Bryan is In the kitchen',
                    publishedAt: new Date('2023-09-29T23:05:00.000Z')
                }])
                fixture.givenNowIs(new Date('2023-09-29T23:05:00.000Z'))
                await fixture.whenUserSeesTheTimelineOf('Alice')
                fixture.thenUserShouldSee([
                    {
                        id: 'message-2',
                        author: 'Bob',
                        text: 'Hello I m BOB',
                        publicationTime: "1 minute ago"
                    },
                    {
                        id: 'message-1',
                        author: 'Alice',
                        text: 'Hello I m Alice',
                        publicationTime: "15 minutes ago"
                    },
                ])
            }
        })
    })
})
const createFixture = () => {
let timeline:{
    author: string,
    text: string,
    publicationTime: string
}[]
    let message: Message
    let now: Date
    const viewTimelineUseCase = new ViewTimelineUseCase()
    const messageRepository = new InMemoryMessageRepository()
    return {
        givenTheFollowinfMessages(messsages: Message[]) {
            messageRepository.givenEixtingMessages(messsages)
        },
        givenNowIs(Date) {
        },
        async whenUserSeesTheTimelineOf(user: string) {
            timeline = await viewTimelineUseCase.handle({user})
        },
        thenUserShouldSee(expectedTimeline: {
            id: string,
            author: string,
            text: string,
            publicationTime: string
        }[]){
            expect(timeline).toEqual(expectedTimeline)
        }
    }
}
type Fixture = ReturnType<typeof createFixture>