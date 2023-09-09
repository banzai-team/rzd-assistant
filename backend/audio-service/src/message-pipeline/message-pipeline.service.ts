import { HttpException, HttpStatus, Inject, Injectable, Logger, forwardRef } from '@nestjs/common';
import { S2T } from 'src/audio/links/s2t.link';
import { CreateMessage } from 'src/conversation/links/create-message.link';
import { UploadMessage } from 'src/conversation/links/upload-message.link';
import { MessageRequest } from './message-pipeline.dto';
import { TextDto } from 'src/audio/audio.dto';
import { BotInteraction } from 'src/bot-interaction/link/bot-interation.link';
import { Conversation } from 'src/conversation/conversation.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConversationService } from 'src/conversation/conversation.service';

@Injectable()
export class MessagePipelineService {

    private readonly logger = new Logger(MessagePipelineService.name);

    constructor(
        private readonly uploadMessage: UploadMessage,
        private readonly s2t: S2T,
        private readonly createMessage: CreateMessage,
        private readonly botInteraction: BotInteraction,
        private readonly conversationService : ConversationService
        ) {}

    async fileChain(conversationId: number, msg: MessageRequest): Promise<any> {
        const conversation = await this.conversationService.getConversationById(conversationId);
        if (!conversation) {
            this.logger.error(`Conversation with id::${conversationId} was not found`)
            throw new HttpException('Not found', HttpStatus.NOT_FOUND);
        }
        
        const savedFile = await this.uploadMessage.saveFile(msg.file);
        const text = await this.s2t.s2t(savedFile);
        const message = await this.createMessage.createMessage(conversationId, msg.source, text, savedFile.path);
        const context = await this.conversationService.getConversationHistory(conversationId, {
            offset: 0,
            size: 100
        });
        const botResponse = this.botInteraction.askBot({
            message: message.content,
            model: conversation.train,
            context: context.content.map(m => m.content)
        });

    }

    async textChain(conversationId: number, text: TextDto) {
        const message = await this.createMessage.createMessage(conversationId, 'user', text);
    }

}
