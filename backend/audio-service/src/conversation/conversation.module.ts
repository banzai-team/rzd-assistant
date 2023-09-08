import { Module } from '@nestjs/common';
import { ConversationController } from './conversation.controller';
import { AudioModule } from 'src/audio/audio.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    AudioModule, 
    ConfigModule
  ],
  controllers: [ConversationController]
})
export class ConversationModule {}
