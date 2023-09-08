import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { AudioModule } from './audio/audio.module';
import { DocumentationModule } from './documentation/documentation.module';
import { ConversationModule } from './conversation/conversation.module';

@Module({
  imports: [
    AudioModule,
    ConfigModule.forRoot({
      load: [configuration],
    }),
    DocumentationModule,
    ConversationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
