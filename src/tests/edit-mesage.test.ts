import {beforeEach, describe, test} from "bun:test";

import { createMessagingFixture, MessagingFixture } from "./messaging.fixture";
import {messageBuilder} from "./message-builder.ts";


describe("Feature: editing a message", () => {
    let fixture: MessagingFixture;

    beforeEach(() => {
        fixture = createMessagingFixture();
    });

    describe("Rule: The edited text should not be superior to 280 characters", () => {
        test("Alice can edit her message to a text inferior to 280 characters", async () => {
            const aliceMessageBuilder = messageBuilder()
                .withId("message-id")
                .authoredBy("Alice")
                .withText("Hello Wrld");
            fixture.givenTheFollowingMessagesExist([aliceMessageBuilder.build()]);

            await fixture.whenUserEditsMessage({
                messageId: "message-id",
                text: "Hello World",
            });

            fixture.thenMessageShouldBe(
                aliceMessageBuilder.withText("Hello World").build()
            );
        });
    });
});