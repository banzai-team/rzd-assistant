import { Module } from '@nestjs/common';
import { BotInteractionService } from './bot-interaction.service';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { BotInteraction } from './link/bot-interation.link';

@Module({
  imports: [
    ConfigModule,
    HttpModule
  ],
  providers: [BotInteractionService, BotInteraction],
  exports: [BotInteraction]
})
export class BotInteractionModule {}
