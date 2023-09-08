import { Module } from '@nestjs/common';
import { DocumentationParser } from './documentation.parser';
import { DocumentationController } from './documentation.controller';

@Module({
  providers: [DocumentationParser],
  controllers: [DocumentationController]
})
export class DocumentationModule {}
