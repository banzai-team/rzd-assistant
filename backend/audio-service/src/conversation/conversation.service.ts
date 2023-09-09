import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { Conversation, Message } from './conversation.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateConversationRequest, Page, PageableQuery } from './conversation.dto';
import { ModelType } from 'src/bot-interaction/bot-interaction.enum';
import { MessageSource } from './conversation.enum';

@Injectable()
export class ConversationService {

    private readonly logger = new Logger(ConversationService.name);

    constructor(
        @InjectRepository(Conversation) private readonly conversationRepository: Repository<Conversation>,
        @InjectRepository(Message) private readonly messageRepository: Repository<Message>,
    ) {}

    async createConversation(create: CreateConversationRequest) {
        this.logger.debug(`Creating conversation...`)
        let conv = new Conversation();
        conv.train = create.train;
        conv.model = create.modelType || ModelType.DEFAULT_TEXT_MODEL;
        conv = await this.conversationRepository.save(conv);
        this.logger.debug(`Conversation was created`)
        return conv;
    }

    async createMessage(conversationId: number, source: MessageSource, text: string, filePath?: string) {
        this.logger.debug(`Creating message...`)
        const conversation = await this.conversationRepository.findOne({
            where: {
                id: conversationId
            }
        });
        if (!conversation) {
            this.logger.debug(`Conversation with id::${conversationId} was not found`);
            throw new HttpException(`Conversation with id::${conversationId} does not exist`, HttpStatus.BAD_REQUEST);
        }
        let msg = new Message();
        msg.content = text
        msg.time = new Date();
        msg.source = source;
        msg.conversation = conversation;
        msg.audio = filePath;
        msg = await this.messageRepository.save(msg);
        this.logger.debug(`Message id::${msg.id} content::${msg.content} was created`);
        return msg;
    }

    async getConversations(): Promise<Conversation[]> {
        return await this.conversationRepository.find({
            relations: {
                messages: false
            }
        });
    }

    async getConversationById(id: number): Promise<Conversation> {
        return await this.conversationRepository.findOne({
            where: {
                id
            },
            relations: {
                messages: false
            }
        });
    }

    async getConversationHistory(conversationId: number, pageableRequest: PageableQuery): Promise<Page> {
        const [result, total] = await this.messageRepository.findAndCount(
            {
                where: {
                    conversation: {
                        id: conversationId
                    }
                },
                order: { time: "DESC" },
                take: pageableRequest.size,
                skip: pageableRequest.offset
            }
        );

        return {
            content: result,
            offset: pageableRequest.offset,
            size: result.length,
            total
        }
    }

    async patchMessage(id: number, messagePatch: Message) {
        const message = await this.messageRepository.findOne({
            where: {
                id
            }
        });
        if (!message) {
            throw new HttpException('Not found', HttpStatus.NOT_FOUND);
        }
        if (messagePatch.content) {
            message.content = messagePatch.content;
        }
        return await this.messageRepository.save(message);
    }
}
