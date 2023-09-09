import { Controller, Get, Inject, Logger, Param, ParseIntPipe, Post, Query, UploadedFile, UseInterceptors, forwardRef } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ConversationService } from './conversation.service';
import { CreateConversationRequest } from './conversation.dto';
import { MessagePipelineService } from 'src/message-pipeline/message-pipeline.service';


@Controller('conversation')
export class ConversationController {
    private readonly logger = new Logger(ConversationController.name);

    constructor(
        private readonly conversationService: ConversationService,
        private readonly messagePipeline: MessagePipelineService,
        ) {}
    
    @Post('/:id/upload')
    @UseInterceptors(FileInterceptor('file'))
    async upload(
        @Param('id', ParseIntPipe) conversationId: number,
        @UploadedFile() file: Express.Multer.File,
        ) {
            const res = await this.messagePipeline.pipe({
                conversationId,
                file: {
                        buffer: file.buffer,
                        filename: file.originalname,
                        mimetype: file.mimetype,
                },
                source: 'user'
            });
            return res
    }

    @Post('create')
    async create(create: CreateConversationRequest) {
        return await this.conversationService.createConversation(create);
    }

    @Get(':id')
    async loadConversation(@Param('id', ParseIntPipe) id: number) {
        
    }

    @Get('/:id/messages')
    async getConversationMessages(
        @Param('id', ParseIntPipe) conversationId: number,
        @Query('offset') offset: number, 
        @Query('size') size: number) {
        return await this.conversationService.getConversationHistory(conversationId, {
            offset: offset || 0, 
            size: size || 10
        })
    }
}
