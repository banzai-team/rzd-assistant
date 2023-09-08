import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { AudioHandler } from 'src/audio/audio.handler';

@Controller('conversation')
export class ConversationController {
    constructor(private readonly handler: AudioHandler) {}
    
    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    async upload(@UploadedFile() file: Express.Multer.File) {
        await this.handler.persistAudio({
            buffer: file.buffer,
            filename: file.originalname,
            mimetype: file.mimetype,
        });
    }
}
