#!/usr/bin/env bun
import {Command} from "commander";
import {PostMessageCommand, PostMessageUseCase} from "./src/application/usecases/post-message-use.case.ts";
import {FileSystemMessageRepository} from "./src/infra/message.fs.repository.ts";
import {StubDateProvider} from "./src/infra/stub-date-provider.ts";
import {v4 as uuidv4} from "uuid";
import {ViewTimelineUseCase} from "./src/application/usecases/view-timeline.usecase.ts";
import {EditMessageCommand, EditMessageUseCase} from "./src/application/usecases/edit-message.usecase.ts";
const messageRepository = new FileSystemMessageRepository();
const dateProvider = new StubDateProvider();
const postMessageUseCase = new PostMessageUseCase(
    messageRepository,
    dateProvider
);
const viewTimelineUseCase = new ViewTimelineUseCase(
    messageRepository,
    dateProvider)
const editMessageUseCase = new EditMessageUseCase(messageRepository);

const program = new Command();
program
    .version("1.0.0")
    .description("Crafty social network")
    .addCommand(
        new Command("post")
            .argument("<user>", "the current user")
            .argument("<message>", "the message to post")
            .action(async (user, message) => {
                const postMessageCommand: PostMessageCommand = {
                    id: uuidv4(),
                    author: user,
                    text: message,
                };
                try {
                    await postMessageUseCase.handle(postMessageCommand);
                    console.log("✅ Message posté");
                    process.exit(0);
                } catch (err) {
                    console.error("❌", err);
                    process.exit(1);
                }
            }))  .addCommand(
    new Command("edit")
        .argument("<message-id>", "the message id of the message to edit")
        .argument("<message>", "the new text")
        .action(async (messageId, message) => {
            const editMessageCommand: EditMessageCommand = {
                messageId,
                text: message,
            };
            try {
                await editMessageUseCase.handle(editMessageCommand);
                console.log("✅ Message edité");
                process.exit(0);
            } catch (err) {
                console.error("❌", err);
                process.exit(1);
            }
        })
).addCommand(
    new Command("view")
        .argument("<user>", "the user to view the timeline of")
        .action(async (user) => {
            try {
                const timeline = await viewTimelineUseCase.handle({user});
                console.table(timeline);
                process.exit(0);
            } catch (err) {
                console.error(err);
                process.exit(1);
            }
        })
);

async function main() {
    await program.parseAsync();
}

main();