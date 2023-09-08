import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { SpeechDto, TextDto, UploadedFile } from './audio.dto';
import * as fs from 'fs';
import { ConfigService } from '@nestjs/config';
import { FileStorageConfig } from 'src/config/configuration';
import { join } from 'path';
import { HttpService } from '@nestjs/axios';
import { Observable, catchError, firstValueFrom, map } from 'rxjs';

@Injectable()
export class AudioHandler {
    private readonly logger = new Logger(AudioHandler.name);
    private readonly s2tConfig;
    private readonly t2sConfig;
    private readonly fileStorageConfig: FileStorageConfig;

    constructor(private readonly http: HttpService, 
        private configService: ConfigService) {
        this.s2tConfig = this.configService.get('s2t');
        this.t2sConfig = this.configService.get('t2s');
        this.fileStorageConfig = this.configService.get('fileStorage');
    }

    async s2t(file: UploadedFile): Promise<TextDto> {
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
            const text = await this.s2tInternal({
                path: savePath,
            });
            return text
        } else {
            this.logger.error(`Storing non locally is not supported`)
            throw new HttpException(`Storing file non locally is not supported`, HttpStatus.BAD_REQUEST)
        }
    }

    private async s2tInternal(speech: SpeechDto): Promise<TextDto> {
        this.logger.debug(`Transforming speech::${speech.path} into text. Performing request to::${this.s2tConfig.host}:${this.s2tConfig.port}/transform`);
        return await firstValueFrom(
            this.http.post(`http://${this.s2tConfig.host}:${this.s2tConfig.port}/transform`, JSON.stringify({"file_path": speech.path}), {
            headers: {'Content-Type': 'application/json'}
        })
            .pipe(
                map(res => ({text: res.data.result}))
            )
            .pipe(
                catchError(() => {
                    throw new HttpException('S2T service is not available', HttpStatus.SERVICE_UNAVAILABLE);
                }),
            ));
    }

    async t2s(text: TextDto) {    

    }
}
