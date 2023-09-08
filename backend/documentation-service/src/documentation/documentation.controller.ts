import { Controller, Post } from '@nestjs/common';
import { DocumentationParser } from './documentation.parser';

@Controller('documentation')
export class DocumentationController {
    
    constructor(private readonly parser: DocumentationParser) {}

    @Post('/')
    async parseDocumentation() {
        await this.parser.parseDocumentation()
    }
}
