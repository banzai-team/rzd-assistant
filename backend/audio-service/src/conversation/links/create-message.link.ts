import { Injectable, Logger } from "@nestjs/common";
import { ConversationService } from "../conversation.service";
import { MessageSource } from "../conversation.enum";

@Injectable()
export class CreateMessage {
    private readonly logger = new Logger(CreateMessage.name);

    constructor(private readonly conversationService: ConversationService) {
    }

    async createMessage(conversationId: number, source: MessageSource, content: string, filePath?: string) {
        this.logger.debug(`Creating message: conversationId::${conversationId}, source::${source}, content::${content}, filePath::${filePath}`);
        return await this.conversationService.createMessage(
                conversationId, 
                source, 
                content,
                filePath
            );
    }

}