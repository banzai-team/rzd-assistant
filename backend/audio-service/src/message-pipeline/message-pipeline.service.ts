import { HttpException, HttpStatus, Inject, Injectable, Logger, forwardRef } from '@nestjs/common';
import { S2T } from 'src/audio/links/s2t.link';
import { CreateMessage } from 'src/conversation/links/create-message.link';
import { UploadMessage } from 'src/conversation/links/upload-message.link';
import { MessageRequest } from './message-pipeline.dto';
import { TextDto } from 'src/audio/audio.dto';
import { BotInteraction } from 'src/bot-interaction/link/bot-interation.link';
import { Conversation, Message } from 'src/conversation/conversation.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConversationService } from 'src/conversation/conversation.service';
import { Page } from 'src/conversation/conversation.dto';

@Injectable()
export class MessagePipelineService {

    private readonly logger = new Logger(MessagePipelineService.name);

    constructor(
        private readonly uploadMessage: UploadMessage,
        private readonly s2t: S2T,
        private readonly createMessage: CreateMessage,
        private readonly botInteraction: BotInteraction,
        private readonly conversationService: ConversationService
    ) { }

    async fileChain(conversationId: number, msg: MessageRequest): Promise<Message> {
        const conversation = await this.conversationService.getConversationById(conversationId);
        if (!conversation) {
            this.logger.error(`Conversation with id::${conversationId} was not found`)
            throw new HttpException('Not found', HttpStatus.NOT_FOUND);
        }
        const savedFile = await this.uploadMessage.saveFile(msg.file);
        const text = await this.s2t.s2t(savedFile);
        const context = await this.conversationService.getConversationHistory(conversation.id, {
            offset: 0,
            size: 100
        });
        const message = await this.createMessage.createMessage(conversationId, msg.source, text, savedFile.path);
        return await this.commonChain(conversation, message, context);
    }

    async textChain(conversationId: number, text: TextDto): Promise<Message> {
        const conversation = await this.conversationService.getConversationById(conversationId);
        if (!conversation) {
            this.logger.error(`Conversation with id::${conversationId} was not found`)
            throw new HttpException('Not found', HttpStatus.NOT_FOUND);
        }
        const context = await this.conversationService.getConversationHistory(conversation.id, {
            offset: 0,
            size: 100
        });
        const message = await this.createMessage.createMessage(conversationId, 'user', text);
        return await this.commonChain(conversation, message, context);
    }

    private async commonChain(conversation: Conversation, message: Message, context: Page) {
        this.logger.debug(`Sending message::${message.content}, context of length::${context.size}`)
        const botResponse = await this.botInteraction.askBot({
            query: message.content,
            train_id: conversation.train,
            context: context.content.map(m => m.content)
        });
        this.logger.debug(`Bot responded::${JSON.stringify(botResponse)}, model::${conversation.train}`);
        if (botResponse.ok) {
            return await this.createMessage.createMessage(conversation.id, 'bot', { text: botResponse.message });
        } else {
            throw new HttpException(`An error occured::${botResponse.error}`, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }
}
