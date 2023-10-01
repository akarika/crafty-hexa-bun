#!/usr/bin/env bun
import {Command} from "commander";
import {PostMessageCommand, PostMessageUseCase} from "./src/post-message-use.case.ts";
import {FileSystemMessageRepository} from "./src/message.fs.repository.ts";
import {StubDateProvider} from "./stub-date-provider.ts";
import {v4 as uuidv4} from "uuid";
import {ViewTimelineUseCase} from "./src/view-timeline.usecase.ts";

const messageRepository = new FileSystemMessageRepository();
const dateProvider = new StubDateProvider();
const postMessageUseCase = new PostMessageUseCase(
    messageRepository,
    dateProvider
);
const viewTimelineUseCase = new ViewTimelineUseCase(
    messageRepository,
    dateProvider)
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
            })).addCommand(
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