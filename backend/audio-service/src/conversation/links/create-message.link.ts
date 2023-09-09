import { Injectable } from "@nestjs/common";
import { ConversationService } from "../conversation.service";
import { TextDto } from "src/audio/audio.dto";

@Injectable()
export class CreateMessage {
    constructor(private readonly conversationService: ConversationService) {
    }

    async createMessage(conversationId: number, source: string, text: TextDto) {
        return await this.conversationService.createMessage(conversationId, source, text)
    }

}