import {beforeEach, describe, expect, test} from "bun:test";
import {
    DateProvider,
     MessageEmptyError,
    MessageTooLongError,
    PostMessageCommand,
    PostMessageUseCase
} from "../post-message-use.case.ts";
import {MessageRepository} from "../message.repository.ts";

//fixture ?

describe("Feature: Posting a message", () => {
    let fixture : Fixture
    beforeEach(()=>{
        fixture = createFixture()
    })
    describe("Rule: A message can contain a max of 280 char", () => {
        test("Alice can post e message on her timeline", async () => {
            fixture.givenNowIs(new Date('2023-01-19T19:00:00.000Z'))

           await fixture.whenUperPostMessage({
                id: "message-id",
                text: "Hello World",
                author: "Alice"
            })
            fixture.thenPostedMessageShouldBe({
                id: "message-id",
                text: "Hello World",
                author: "Alice",
                publishedAt: new Date('2023-01-19T19:00:00.000Z')
            })
        });
        test("Alice cannot post a message with more 2023 char", async () => {
            const textWithLengthOf281 = "Nam quis nulla. Integer malesuada. In in enim a arcu imperdiet malesuada. Sed vel lectus. Donec odio urna, tempus molestie, porttitor ut, iaculis quis, sem. Phasellus rhoncus. Aenean id metus id velit ullamcorper pulvinar. Vestibulum fermentum tortor id mi. Pellentesque ipsum. Nul"

            fixture.givenNowIs(new Date('2023-01-19T19:00:00.000Z'))
            await fixture.whenUperPostMessage({
                id: "message-id",
                text: textWithLengthOf281,
                author: "Alice"
            })

            fixture.thenErrorShouldBe(MessageTooLongError)


        })
    });
    describe("cannot be empty", () => {
        test("Alice cannot post a message with empty test", async () => {

            fixture.givenNowIs(new Date('2023-01-19T19:00:00.000Z'))
           await fixture.whenUperPostMessage({
                id: "message-id",
                text: "   ",
                author: "Alice"
            })
            fixture.thenErrorShouldBe(MessageEmptyError)
        })
        test("Alice cannot post a message with only whitespaces", async () => {

            fixture.givenNowIs(new Date('2023-01-19T19:00:00.000Z'))
            await fixture.whenUperPostMessage({
                id: "message-id",
                text: "   ",
                author: "Alice"
            })
            fixture.thenErrorShouldBe(MessageEmptyError)
        })
    })
})

type Message = { id: string, author: string, text: string, publishedAt: Date }


class InMemoryMessageRepository implements MessageRepository {
    message: Message

    save(msg: Message): Promise<void> {
        this.message = msg
        return Promise.resolve()
    }

}

class StubDateProvider implements DateProvider {
    now: Date

    getNow(): Date {
        return this.now;
    }
}

const createFixture = () => {
    let message: Message
    let now: Date
    const messageRepository = new InMemoryMessageRepository()
    const dateProvider = new StubDateProvider()
    const postMessageUsecase = new PostMessageUseCase(messageRepository, dateProvider)
    let thrownError: Error
    return {
        givenNowIs(now: Date) {
            dateProvider.now = now
        },
        async whenUperPostMessage(postingMessagesCommand: PostMessageCommand) {
            try {
                await postMessageUsecase.handle(postingMessagesCommand)
            } catch (err) {
                thrownError = err
            }
        }, thenPostedMessageShouldBe(expectdMessage: { text: string; publishedAt: Date; author: string; id: string }) {
            expect(expectdMessage).toEqual(messageRepository.message)
        }, thenErrorShouldBe(expectedErrorClass: new () => Error) {
            expect(thrownError).toBeInstanceOf(expectedErrorClass)
        }
    }
}
type Fixture = ReturnType<typeof createFixture>