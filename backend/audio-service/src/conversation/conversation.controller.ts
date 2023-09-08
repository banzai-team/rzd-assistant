import { Controller, Get, Logger, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AudioHandler } from 'src/audio/audio.handler';

@Controller('conversation')
export class ConversationController {
    private readonly logger = new Logger(ConversationController.name);

    constructor(private readonly handler: AudioHandler) {}
    
    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    async upload(@UploadedFile() file: Express.Multer.File) {
        const text = await this.handler.s2t({
            buffer: file.buffer,
            filename: file.originalname,
            mimetype: file.mimetype,
        });
    }
}
