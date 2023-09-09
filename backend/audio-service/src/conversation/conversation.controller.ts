import { Body, Controller, Get, HttpException, HttpStatus, Inject, Logger, Param, ParseIntPipe, Patch, Post, Query, UploadedFile, UseInterceptors, forwardRef } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ConversationService } from './conversation.service';
import { CreateConversationRequest } from './conversation.dto';
import { MessagePipelineService } from 'src/message-pipeline/message-pipeline.service';
import { MessageSource } from './conversation.enum';
import { Message } from './conversation.entity';


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
        @Body() body,
        ) {
            if (file) {
                const res = await this.messagePipeline.fileChain(
                    conversationId,
                    {
                        file: {
                                buffer: file.buffer,
                                filename: file.originalname,
                                mimetype: file.mimetype,
                        },
                        source: MessageSource.USER
                    });
                return res
            } else if (body.text) {
                this.logger.debug(`Sending raw text::${body.text}`)
                const res = await this.messagePipeline.textChain(conversationId, body.text);
                return res
            } 
    }

    @Post('create')
    async create(@Body() create: CreateConversationRequest) {
        return await this.conversationService.createConversation(create);
    }

    @Get('list')
    async conversations() {
        return await this.conversationService.getConversations();
    }

    @Get(':id')
    async loadConversation(@Param('id', ParseIntPipe) id: number) {
        const conv = await this.conversationService.getConversationById(id);
        if (!conv) {
            throw new HttpException('Not found', HttpStatus.NOT_FOUND);
        }
        return conv
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

    @Patch('message/:id')
    async patchMessage(@Param('id', ParseIntPipe) messageId: number, @Body() message: Message) {
        return await this.conversationService.patchMessage(messageId, message);
    }

    @Patch('message/:id')
    async patchMessageText(@Param('id', ParseIntPipe) messageId: number, @Body() content: string) {
        const msg = new Message();
        msg.content = content
        return await this.conversationService.patchMessage(messageId, msg);
    }
}
