import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { Speech, UploadedFile } from './audio.dto';
import * as fs from 'fs';
import { ConfigService } from '@nestjs/config';
import { FileStorageConfig } from 'src/config/configuration';
import { join } from 'path';

@Injectable()
export class AudioHandler {
    private readonly logger = new Logger(AudioHandler.name);
    private readonly s2tConfig;
    private readonly t2sConfig;
    private readonly fileStorageConfig: FileStorageConfig;

    
    constructor(private configService: ConfigService) {
        this.s2tConfig = this.configService.get('s2t');
        this.t2sConfig = this.configService.get('t2s');
        this.fileStorageConfig = this.configService.get('fileStorage');
        this.logger.debug(`Imported audio configuration. s2t::${JSON.stringify(this.s2tConfig)}, t2s::${JSON.stringify(this.t2sConfig)}`)

    }

    async persistAudio(file: UploadedFile) {
        if (this.fileStorageConfig.local) {
            const savePath = join(this.fileStorageConfig.dir, file.filename) 
            this.logger.debug(`Persiting file::${file.filename}.${file.mimetype} locally::${savePath}`)
            fs.mkdirSync(this.fileStorageConfig.dir, { recursive: true });
            fs.writeFile(savePath, file.buffer, (err) => {
                if(err) {
                    this.logger.error(`File can't be saved. Reason::${err}`)
                }
                this.logger.debug(`File was successfuly saved in ${savePath}`)
            });
        } else {
            this.logger.error(`Storing non locally is not supported`)
            throw new HttpException(`Storing file non locally is not supported`, HttpStatus.BAD_REQUEST)
        }
    }

    async s2t(speech: Speech) {

    }

    async t2s(text: Text) {    

    }
}
