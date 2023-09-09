import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { UploadedFile } from 'src/audio/audio.dto';
import { AudioHandler } from 'src/audio/audio.handler';
import { S2T } from 'src/audio/links/s2t.link';
import { CreateMessage } from 'src/conversation/links/create-message.link';
import { UploadMessage } from 'src/conversation/links/upload-message.link';
import { MessageRequest } from './message-pipeline.dto';

@Injectable()
export class MessagePipelineService {

    constructor(
        private readonly uploadMessage: UploadMessage,
        private readonly s2t: S2T,
        private readonly createMessage: CreateMessage,
        ) {}

    async pipe(msg: MessageRequest) {
        const savedFile = await this.uploadMessage.saveFile(msg.file);
        const text = await this.s2t.s2t(savedFile);
        return await this.createMessage.createMessage(msg.conversationId, msg.source, text);
    }


}
