import {DateProvider} from "./src/post-message-use.case.ts";

export class StubDateProvider implements DateProvider {
    now: Date = new Date()
    getNow(): Date {
        return this.now;
    }
}