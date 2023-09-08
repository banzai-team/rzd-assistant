import { Injectable } from '@nestjs/common';
import { XMLParser, XMLValidator } from 'fast-xml-parser';
import * as fs from 'fs';

@Injectable()
export class DocumentationParser {

    constructor() {
        
    }

    async parseDocumentation() {
        const file = fs.readFileSync("./documentation.xml", {encoding: 'utf-8'})
        const content = file.toString();
        const result = XMLValidator.validate(content);
        if (!result) {
            console.error("Xml documentation is invalid")
        }
        const options = {
            ignoreAttributes: false,
            allowBooleanAttributes: true
        };
        const parser = new XMLParser(options);
        const json = parser.parse(content);
        const tables = json['office:document']['office:body']['office:text']['table:table']

        for (const table of tables) {
            console.log(table['@_table:name'])
            // console.log(table)
        }
    }
}
