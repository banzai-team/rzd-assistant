import { Injectable } from '@nestjs/common';
import { XMLParser, XMLValidator } from 'fast-xml-parser';
import * as fs from 'fs';
import { Attachment } from './documentation.model';

@Injectable()
export class DocumentationParser {

    private interestTables: string[];
    constructor() {
        this.interestTables = [
            ''
        ]
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
        const attachment = new Attachment()
        for (const table of tables) {
            // console.log(table['@_table:name'])
            // console.log(table)
            const rows = table['table:table-row']
            for (const row of rows) {
                // console.log(row['table:table-cell'])
                const cols = row['table:table-cell']
                // console.log(cols)
                if (cols.length) {
                    const malfunctionNumber = cols[0]['text:p']['#text']
                    const malfunctionName = cols[1]['text:p']['#text']
                    const reasons = cols?.[2]?.['text:p']['#text']
                    const solutions = cols?.[3]?.['text:p']
                    console.log(cols?.[3]?.['text:p'])
                    console.log(`malfunctionNumber::${malfunctionNumber}`)
                    console.log(`malfunctionName::${malfunctionName}`)
                    console.log(`reasons::${reasons}`)
                    console.log(`solutions::${solutions}`)
                    // const reasons = cols[1][]
                    // for (const col of cols) {
                    //     console.log(col['text:p'])
                    // }
                }
                // const cols = row
                // for (const col of row) {
                //     console.log(col)
                // }
                // if (text['text:span']) {
                    
                // } else {

                // }
            }
            
            // break
            // for (const row of rows) {
            //     console.log(row)
            // }
        }
    }
}
