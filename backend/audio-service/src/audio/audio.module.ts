import { Module } from '@nestjs/common';
import { AudioHandler } from './audio.handler';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { S2T } from './links/s2t.link';

@Module({
  imports: [
    ConfigModule, 
    HttpModule
  ],
  providers: [AudioHandler, S2T],
  exports: [AudioHandler, S2T]
})
export class AudioModule {}
