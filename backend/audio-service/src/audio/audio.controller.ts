import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AudioHandler } from './audio.handler';

@Controller('audio')
export class AudioController {

    constructor(private readonly handler: AudioHandler) {}

    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    async upload(@UploadedFile() file: Express.Multer.File) {
        await this.handler.handleAudio(file);
    }
}
