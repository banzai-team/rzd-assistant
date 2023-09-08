import { Module } from '@nestjs/common';
import { AudioHandler } from './audio.handler';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [AudioHandler],
  exports: [AudioHandler]
})
export class AudioModule {}
