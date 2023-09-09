import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './config/configuration';
import { AudioModule } from './audio/audio.module';
import { ConversationModule } from './conversation/conversation.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSourceOptions } from 'typeorm';

@Module({
  imports: [
    AudioModule,
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    ConversationModule,
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => configService.get<DataSourceOptions>('db'),
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
