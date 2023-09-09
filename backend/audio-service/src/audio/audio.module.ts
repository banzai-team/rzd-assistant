import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { S2T } from './links/s2t.link';

@Module({
  imports: [
    ConfigModule, 
    HttpModule
  ],
  providers: [S2T],
  exports: [S2T]
})
export class AudioModule {}
