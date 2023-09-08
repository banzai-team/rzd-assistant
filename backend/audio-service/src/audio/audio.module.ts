import { Module } from '@nestjs/common';
import { AudioHandler } from './audio.handler';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    ConfigModule, 
    HttpModule
  ],
  providers: [AudioHandler],
  exports: [AudioHandler]
})
export class AudioModule {}
