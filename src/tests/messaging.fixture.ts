// dsl domaine spceficique language
// simplie écrituer test car éutilise les mêmem étapes de test
import {
    EditMessageCommand,
        EditMessageUseCase,
} from "../application/usecases/edit-message.usecase.ts";
import {StubDateProvider} from "../infra/stub-date-provider.ts";
import {InMemoryMessageRepository} from "../infra/message.inmemory.repository.ts";
import {PostMessageCommand, PostMessageUseCase} from "../application/usecases/post-message-use.case.ts";
import {Message} from "../domaine/message.ts";
import {expect} from "bun:test";
import {ViewTimelineUseCase} from "../application/usecases/view-timeline.usecase.ts";


export const createMessagingFixture = () => {
    const dateProvider = new StubDateProvider();
    const messageRepository = new InMemoryMessageRepository();
    const postMessageUseCase = new PostMessageUseCase(
        messageRepository,
        dateProvider
    );
    let thrownError: Error;
    let timeline: {
        author: string;
        text: string;
        publicationTime: string;
    }[];
    const viewTimelineUseCase = new ViewTimelineUseCase(
        messageRepository,
        dateProvider
    );
    const postMessageUseCase = new PostMessageUseCase(
        messageRepository,
        dateProvider
    );
    const editMessageUseCase = new EditMessageUseCase(messageRepository);
    return {
        givenTheFollowingMessagesExist(messages: Message[]) {
            messageRepository.givenExistingMessages(messages);
        },
        givenNowIs(now: Date) {
            dateProvider.now = now;
        },
        async whenUserPostsAmessage(postMessageCommand: PostMessageCommand) {
            try {
                await postMessageUseCase.handle(postMessageCommand);
            } catch (err) {
                thrownError = err;
            }
        },
        async whenUserEditsMessage(editMessageCommand: EditMessageCommand) {
            try {
                await editMessageUseCase.handle(editMessageCommand);
            } catch (err) {
                thrownError = err;
            }
        },
        async whenUserSeesTheTimelineOf(user: string) {
            timeline = await viewTimelineUseCase.handle({user});
        },
        async thenMessageShouldBe(expectedMessage: Message) {
            const message = await messageRepository.getById(expectedMessage.id);
            expect(message).toEqual(expectedMessage);
        },
        async whenUserEditsMessage(editMessageCommand: {
            messageId: string;
            text: string;
        }) {
        },

        thenMessageShouldBe(expectedMessage: Message) {
            expect(expectedMessage).toEqual(
                messageRepository.getMessageById(expectedMessage.id)
            );
        },

        thenErrorShouldBe(expectedErrorClass: new () => Error) {
            expect(thrownError).toBeInstanceOf(expectedErrorClass);
        },
        thenUserShouldSee(
            expectedTimeline: {
                author: string;
                text: string;
                publicationTime: string;
            }[]
        ) {
            expect(timeline).toEqual(expectedTimeline);
        },
    };
};

export type MessagingFixture = ReturnType<typeof createMessagingFixture>;