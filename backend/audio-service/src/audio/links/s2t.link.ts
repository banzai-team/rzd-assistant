import { HttpService } from "@nestjs/axios";
import { HttpException, HttpStatus, Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { join } from "path";
import { SavedFile } from "src/audio/audio.dto";
import { Observable, catchError, firstValueFrom, map } from 'rxjs';

@Injectable()
export class S2T {
    private readonly logger = new Logger(S2T.name);

    private readonly s2tConfig;

    constructor(private readonly http: HttpService, 
        private configService: ConfigService) {
        this.s2tConfig = this.configService.get('s2t');
    }

    async s2t(file: SavedFile): Promise<string> {
        return await this.s2tInternal({
            path: file.path,
        });
    }

    private async s2tInternal(speech: SavedFile): Promise<string> {
        this.logger.debug(`Transforming speech::${speech.path} into text. Performing request to::${this.s2tConfig.host}:${this.s2tConfig.port}/transform`);
        try {
            const resp = await firstValueFrom(
                this.http.post(`http://${this.s2tConfig.host}:${this.s2tConfig.port}/transform`, {"file_path": speech.path}, {
                headers: {'Content-Type': 'application/json'}
            }));
            const result = Array.isArray(resp.data.result) ? resp.data.result.join() : resp.data.result;
            this.logger.debug(`Speech::${speech.path} was transfored into::${result}`);
            return result;
        } catch(e) {
            throw new HttpException('S2T service in not available', HttpStatus.SERVICE_UNAVAILABLE)
        }
    }
}