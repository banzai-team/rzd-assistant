import { Module } from '@nestjs/common';
import { BotInteractionService } from './bot-interaction.service';

@Module({
  providers: [BotInteractionService]
})
export class BotInteractionModule {}
