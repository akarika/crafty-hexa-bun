#!/usr/bin/env bun
import {Command} from "commander";
import {PostMessageCommand, PostMessageUseCase} from "./src/post-message-use.case.ts";
import {FileSystemMessageRepository} from "./src/message.fs.repository.ts";
import {RealDateProvider} from "./stub-date-rpovider..ts";


const messageRepository = new FileSystemMessageRepository();
const dateProvider = new RealDateProvider();
const postMessageUseCase = new PostMessageUseCase(
    messageRepository,
    dateProvider
);

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
                    id: "some-message-id",
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
            })
    );

async function main() {
    await program.parseAsync();
}

main();