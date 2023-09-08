import { Module } from '@nestjs/common';
import { DocumentationController } from './documentation.controller';
import { DocumentationParser } from './documentation.parser';

@Module({
  controllers: [DocumentationController],
  providers:[DocumentationParser]
})
export class DocumentationModule {}
