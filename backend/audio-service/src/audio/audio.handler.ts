import { Injectable } from '@nestjs/common';
import { UploadedFile } from './file.dto';
import * as fs from 'fs';

@Injectable()
export class AudioHandler {

    async handleAudio(file: UploadedFile) {
        fs.writeFile("file.dat", file.buffer, function(err) {
            if(err) {
                return console.log(err);
            }
            console.log("The file was saved!");
        })
    }
}
