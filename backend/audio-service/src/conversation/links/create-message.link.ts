import { Injectable, Logger } from "@nestjs/common";
import { ConversationService } from "../conversation.service";
import { SavedFile, TextDto } from "src/audio/audio.dto";

@Injectable()
export class CreateMessage {
    private readonly logger = new Logger(CreateMessage.name);

    constructor(private readonly conversationService: ConversationService) {
    }

    async createMessage(conversationId: number, source: string, text: TextDto, filePath?: string) {
        this.logger.debug(`Creating message: conversationId::${conversationId}, source::${source}, text::${text.text}, filePath::${filePath}`);
        return await this.conversationService.createMessage(
                conversationId, 
                source, 
                text,
                filePath
            );
    }

}