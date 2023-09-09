import { Inject, Injectable, Logger, forwardRef } from '@nestjs/common';
import { S2T } from 'src/audio/links/s2t.link';
import { CreateMessage } from 'src/conversation/links/create-message.link';
import { UploadMessage } from 'src/conversation/links/upload-message.link';
import { MessageRequest } from './message-pipeline.dto';
import { TextDto } from 'src/audio/audio.dto';

@Injectable()
export class MessagePipelineService {

    private readonly logger = new Logger(MessagePipelineService.name);

    constructor(
        private readonly uploadMessage: UploadMessage,
        private readonly s2t: S2T,
        private readonly createMessage: CreateMessage,
        ) {}

    async fileChain(conversationId: number, msg: MessageRequest): Promise<any> {
        const savedFile = await this.uploadMessage.saveFile(msg.file);
        const text = await this.s2t.s2t(savedFile);
        return await this.createMessage.createMessage(conversationId, msg.source, text, savedFile.path);
    }

    async textChain(conversationId: number, text: TextDto) {
        return await this.createMessage.createMessage(conversationId, 'user', text);
    }

}
