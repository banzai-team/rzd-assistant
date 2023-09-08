import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Conversation, Message } from './conversation.entity';
import { TextDto } from 'src/audio/audio.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateConversationRequest } from './conversation.dto';

@Injectable()
export class ConversationService {

    constructor(
        @InjectRepository(Conversation) private readonly conversationRepository: Repository<Conversation>,
        @InjectRepository(Message) private readonly messageRepository: Repository<Message>, 
    ) {}

    async createConversation(create: CreateConversationRequest) {
        const conv = new Conversation();
        return await this.conversationRepository.save(conv);
    }

    async createMessage(conversationId: number, source: string, text: TextDto) {
        const conversation = await this.conversationRepository.findOne({
            where: {
                id: conversationId
            }
        });
        if (!conversation) {
            throw new HttpException(`Conversation with id::${conversationId} does not exist`, HttpStatus.BAD_REQUEST);
        }
        const msg = new Message();
        msg.content = text.text
        msg.time = new Date();
        msg.conversation = conversation;
        await this.messageRepository.save(msg);
        return msg;
    }
}
