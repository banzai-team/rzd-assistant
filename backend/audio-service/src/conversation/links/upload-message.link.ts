import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { join } from "path";
import { SavedFile, UploadedFile } from "src/audio/audio.dto";
import { FileStorageConfig } from "src/config/configuration";
import * as fs from 'fs';

@Injectable()
export class UploadMessage {
    private readonly logger = new Logger(UploadMessage.name);
    
    private readonly fileStorageConfig: FileStorageConfig;

    constructor(private configService: ConfigService) {
            this.fileStorageConfig = this.configService.get('fileStorage');
    }
    async saveFile(file: UploadedFile): Promise<SavedFile> {
        const savePath = join(this.fileStorageConfig.dir, file.filename) 
        this.logger.debug(`Persiting file::${file.filename}.${file.mimetype} locally::${savePath}`)
        fs.mkdirSync(this.fileStorageConfig.dir, { recursive: true });
        fs.writeFile(savePath, file.buffer, (err) => {
            if(err) {
                this.logger.error(`File can't be saved. Reason::${err}`)
            }
            this.logger.debug(`File was successfuly saved in ${savePath}`)
        });
        return {
            path: savePath
        }
    }

}