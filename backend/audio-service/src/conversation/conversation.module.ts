import { Module, forwardRef } from '@nestjs/common';
import { ConversationController } from './conversation.controller';
import { AudioModule } from 'src/audio/audio.module';
import { ConfigModule } from '@nestjs/config';
import { ConversationService } from './conversation.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Conversation, Message } from './conversation.entity';
import { UploadMessage } from './links/upload-message.link';
import { CreateMessage } from './links/create-message.link';
import { MessagePipelineModule } from 'src/message-pipeline/message-pipeline.module';

@Module({
  imports: [
    AudioModule, 
    ConfigModule,
    TypeOrmModule.forFeature([Conversation, Message]),
    forwardRef(() =>  MessagePipelineModule)
  ],
  controllers: [ConversationController],
  providers: [
    ConversationService,
    UploadMessage,
    CreateMessage
  ],
  exports: [
    UploadMessage,
    CreateMessage
  ]
})
export class ConversationModule {}
