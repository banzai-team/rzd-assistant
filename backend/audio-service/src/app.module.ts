import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './config/configuration';
import { AudioModule } from './audio/audio.module';
import { ConversationModule } from './conversation/conversation.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSourceOptions } from 'typeorm';
import { MessagePipelineModule } from './message-pipeline/message-pipeline.module';
import { WebsocketModule } from './app/websocket.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

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
    WebsocketModule,
    ServeStaticModule.forRootAsync({
      useFactory: (configService: ConfigService) => ([{
        rootPath: configService.get('fileStorage').dir
      }]),
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
