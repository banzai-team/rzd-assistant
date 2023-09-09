import { Injectable, Logger } from "@nestjs/common";
import { BotRequest, BotResponse } from "../bot-interaction.dto";
import { BotInteractionService } from "../bot-interaction.service";
import { ModelType } from "../bot-interaction.enum";

@Injectable()
export class BotInteraction {
    private readonly logger = new Logger(BotInteraction.name);

    constructor(private readonly botInteraction: BotInteractionService) {}

    async askBot(model: ModelType, request: BotRequest): Promise<BotResponse> {
        this.logger.debug(`Asking bot::${JSON.stringify(request)}`);
        const botResp = await this.botInteraction.askBot(model, request);
        this.logger.debug(`Bot responded with::${JSON.stringify(botResp)}`);
        return botResp;
    }
}