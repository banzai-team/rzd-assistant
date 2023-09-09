import { HttpService } from "@nestjs/axios";
import { HttpException, HttpStatus, Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { join } from "path";
import { SavedFile, TextDto, UploadedFile } from "src/audio/audio.dto";
import { Observable, catchError, firstValueFrom, map } from 'rxjs';

@Injectable()
export class S2T {
    private readonly logger = new Logger(S2T.name);

    private readonly s2tConfig;

    constructor(private readonly http: HttpService, 
        private configService: ConfigService) {
        this.s2tConfig = this.configService.get('s2t');
    }

    async s2t(file: SavedFile): Promise<TextDto> {
        const text = await this.s2tInternal({
            path: file.path,
        });
        return text
    }

    private async s2tInternal(speech: SavedFile): Promise<TextDto> {
        this.logger.debug(`Transforming speech::${speech.path} into text. Performing request to::${this.s2tConfig.host}:${this.s2tConfig.port}/transform`);
        try {
            const resp = await firstValueFrom(
                this.http.post(`http://${this.s2tConfig.host}:${this.s2tConfig.port}/transform`, JSON.stringify({"file_path": speech.path}), {
                headers: {'Content-Type': 'application/json'}
            }));
            this.logger.debug(`Speech::${speech.path} was transfored into::${resp.data.result}`);
            return {
                text: resp.data.result
            }
        } catch(e) {
            throw new HttpException('S2T service in not available', HttpStatus.SERVICE_UNAVAILABLE)
        }
    }
}