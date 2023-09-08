import { Module } from '@nestjs/common';
import { AudioController } from './audio.controller';
import { AudioHandler } from './audio.handler';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  controllers: [AudioController],
  providers: [AudioHandler]
})
export class AudioModule {}
