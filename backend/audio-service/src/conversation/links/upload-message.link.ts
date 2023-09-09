import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { join } from "path";
import { SavedFile, UploadedFile } from "src/audio/audio.dto";
import { FileStorageConfig } from "src/config/configuration";
import * as fs from 'fs';
import * as FFmpeg from 'ffmpeg';
import { randomUUID } from "crypto";



@Injectable()
export class UploadMessage {
    private readonly logger = new Logger(UploadMessage.name);
    
    private readonly fileStorageConfig: FileStorageConfig;

    constructor(private configService: ConfigService) {
            this.fileStorageConfig = this.configService.get('fileStorage');
    }
    async saveFile(file: UploadedFile): Promise<SavedFile> {
        const uuid = randomUUID();
        const savePath = join(this.fileStorageConfig.dir, file.filename + uuid + '.webM') 
        this.logger.debug(`Persiting file::${file.filename}.${file.mimetype} locally::${savePath}`)
        fs.mkdirSync(this.fileStorageConfig.dir, { recursive: true });
        fs.writeFileSync(savePath, file.buffer);
        this.logger.debug(`File was successfuly saved in ${savePath}`);
        const mp3Path = await this.webMToMp3(savePath)
        return {
            path: mp3Path
        }
    }

    webMToMp3(path: string): Promise<string> {
        return new Promise((res, rej) => {
            try {
                const newPath = path.replace('webM', 'mp3')
                var process = new FFmpeg(path);
                process.then(function (video) {
                    video.fnExtractSoundToMP3(newPath, function (error, file) {
                        if (!error) {
                            console.log('Audio file: ' + file);
                            res(newPath)
                        } else {
                            this.logger.error('error::', error)
                            rej(error);
                        }
                    });
                }, function (err) {
                    this.logger.error('Error: ' + err);
                    rej(err);
                });
            } catch (e) {
                this.logger.error(e.code);
                this.logger.error(e.msg);
                rej(e);
            }
        });
        
    }

}