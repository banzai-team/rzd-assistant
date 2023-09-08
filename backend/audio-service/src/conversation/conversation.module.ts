import { Module } from '@nestjs/common';
import { ConversationController } from './conversation.controller';
import { AudioModule } from 'src/audio/audio.module';
import { ConfigModule } from '@nestjs/config';
import { ConversationService } from './conversation.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Conversation, Message } from './conversation.entity';

@Module({
  imports: [
    AudioModule, 
    ConfigModule,
    TypeOrmModule.forFeature([Conversation, Message])
  ],
  controllers: [ConversationController],
  providers: [ConversationService]
})
export class ConversationModule {}
