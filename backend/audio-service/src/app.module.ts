import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './config/configuration';
import { AudioModule } from './audio/audio.module';
import { ConversationModule } from './conversation/conversation.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSourceOptions } from 'typeorm';
import { AppGateway } from './app/app.gateway';
import { MessagePipelineModule } from './message-pipeline/message-pipeline.module';

@Module({
  imports: [
    AudioModule,
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
      envFilePath: '.env.dev'
    }),
    ConversationModule,
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => configService.get<DataSourceOptions>('db'),
      inject: [ConfigService],
    }),
    MessagePipelineModule,
  ],
  controllers: [AppController],
  providers: [AppService, AppGateway],
})
export class AppModule {}
