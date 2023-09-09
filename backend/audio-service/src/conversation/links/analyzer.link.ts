import { Logger } from "@nestjs/common";

export class AnalyzeMessage {

    private readonly logger = new Logger(AnalyzeMessage.name);

    async analyze() {
        this.logger.debug("Sending message to helper...")
        return 
    }
}