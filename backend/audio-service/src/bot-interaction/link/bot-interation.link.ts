import { Injectable } from "@nestjs/common";
import { BotRequest, BotResponse } from "../bot-interaction.dto";
import { BotInteractionService } from "../bot-interaction.service";

@Injectable()
export class BotInteraction {

    constructor(private readonly botInteraction: BotInteractionService) {}

    async askBot(request: BotRequest): Promise<BotResponse> {
        return await this.botInteraction.askBot(request);
    }
}