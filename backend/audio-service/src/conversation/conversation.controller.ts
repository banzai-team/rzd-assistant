import { Controller, Get, Logger, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AudioHandler } from 'src/audio/audio.handler';
import { ConversationService } from './conversation.service';
import { CreateConversationRequest } from './conversation.dto';

@Controller('conversation')
export class ConversationController {
    private readonly logger = new Logger(ConversationController.name);

    constructor(private readonly audioHandler: AudioHandler,
        private readonly conversationService: ConversationService) {}
    
    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    async upload(
        @UploadedFile() file: Express.Multer.File,
        @Query('conversation') conversationId: number
        ) {
        const text = await this.audioHandler.s2t({
            buffer: file.buffer,
            filename: file.originalname,
            mimetype: file.mimetype,
        });
        return await this.conversationService.createMessage(conversationId, 'user', text );
    }

    @Post('create')
    async create(create: CreateConversationRequest) {
        return await this.conversationService.createConversation(create);
    }
}
