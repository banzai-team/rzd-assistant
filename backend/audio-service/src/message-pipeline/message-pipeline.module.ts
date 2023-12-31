import { Module, forwardRef } from '@nestjs/common';
import { MessagePipelineService } from './message-pipeline.service';
import { AudioModule } from 'src/audio/audio.module';
import { ConversationModule } from 'src/conversation/conversation.module';
import { BotInteractionModule } from 'src/bot-interaction/bot-interaction.module';

@Module({
  imports: [AudioModule, forwardRef(() =>  ConversationModule), BotInteractionModule],
  providers: [MessagePipelineService],
  exports: [MessagePipelineService]
})
export class MessagePipelineModule {}
