import { Module } from '@nestjs/common';
import { AudioController } from './audio.controller';
import { AudioHandler } from './audio.handler';

@Module({
  controllers: [AudioController],
  providers: [AudioHandler]
})
export class AudioModule {}
