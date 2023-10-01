import {DateProvider} from "./src/post-message-use.case.ts";

export class RealDateProvider implements DateProvider {
    now:Date;
    getNow(): Date {
        return this.now;
    }
}