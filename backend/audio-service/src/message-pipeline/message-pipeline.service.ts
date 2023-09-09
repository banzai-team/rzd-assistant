import { HttpException, HttpStatus, Inject, Injectable, Logger, forwardRef } from '@nestjs/common';
import { S2T } from 'src/audio/links/s2t.link';
import { CreateMessage } from 'src/conversation/links/create-message.link';
import { UploadMessage } from 'src/conversation/links/upload-message.link';
import { MessageRequest } from './message-pipeline.dto';
import { BotInteraction } from 'src/bot-interaction/link/bot-interation.link';
import { Conversation, Message } from 'src/conversation/conversation.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConversationService } from 'src/conversation/conversation.service';
import { Page } from 'src/conversation/conversation.dto';
import { ModelType } from 'src/bot-interaction/bot-interaction.enum';

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

    async textChain(conversationId: number, text: string): Promise<Message> {
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

    private async commonChain(conversation: Conversation, message: Message, context: Page): Promise<Message> {
        this.logger.debug(`Sending message::${message.content}, context of length::${context.size}`);
        if (conversation.model == ModelType.DEFAULT_TEXT_MODEL) {
            return await this.handleDefaultModel(conversation, message, context);
        } else {
            return await this.handleRuleBasedModel(conversation, message, context);
        }
        
    }

    /**
     * Returns complete message at once
     */
    private async handleRuleBasedModel(conversation: Conversation, message: Message, context: Page): Promise<Message> {
        const botResponse = await this.botInteraction.askBot(
            conversation.model,
            {
                query: message.content,
                train_id: conversation.train,
                context: context.content.map(m => m.content)
            }
        );
        this.logger.debug(`Bot responded::${JSON.stringify(botResponse)}, model::${conversation.train}`);
        if (botResponse.ok) {
            return await this.createMessage.createMessage(conversation.id, 'bot', botResponse.message);
        } else {
            throw new HttpException(`An error occured::${botResponse.error}`, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    } 

    /**
     * Creates blank response message in db. The message perioducaly gets updated
     */
    private async handleDefaultModel(conversation: Conversation, message: Message, context: Page): Promise<Message> {
        const preparedResponseMessage = await this.createMessage.createMessage(conversation.id, message.source, '');
        this.logger.debug(`Created blank response message::${JSON.stringify(preparedResponseMessage)} to be updated in the future`);
        // response is ignored
        await this.botInteraction.askBot(
            conversation.model,
            {
                query: message.content,
                train_id: conversation.train,
                context: context.content.map(m => m.content),
                message_id: preparedResponseMessage.id
            }
        );
        return preparedResponseMessage;
    }
}
