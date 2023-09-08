import { Injectable } from '@nestjs/common';
import { Speech, UploadedFile } from './audio.dto';
import * as fs from 'fs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AudioHandler {
    private readonly s2tConfig;
    private readonly t2sConfig;
    
    constructor(private configService: ConfigService) {
        this.s2tConfig = this.configService.get('s2t')
        this.t2sConfig = this.configService.get('t2s')
    }

    async handleAudio(file: UploadedFile) {
        fs.writeFile("file.dat", file.buffer, function(err) {
            if(err) {
                return console.log(err);
            }
            console.log("The file was saved!");
        });
    }

    async s2t(speech: Speech) {

    }

    async t2s(text: Text) {    

    }
}
