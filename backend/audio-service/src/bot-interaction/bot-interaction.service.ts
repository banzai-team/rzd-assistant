import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BotRequest, BotResponse } from './bot-interaction.dto';
import { ConnectionConfig } from 'src/config/configuration';
import { Observable, catchError, firstValueFrom, map } from 'rxjs';

@Injectable()
export class BotInteractionService {
    private readonly logger = new Logger(BotInteractionService.name);
    private readonly botConfig: ConnectionConfig;

    constructor(private readonly http: HttpService, configService: ConfigService,) {
        this.botConfig = configService.get('bot');
    }

    async askBot(request: BotRequest): Promise<BotResponse> | never {
        try {
            this.logger.debug(`Making request to ask chat bot on http://${this.botConfig.host}:${this.botConfig.port}/chat...`)
            const resp = await firstValueFrom(
                this.http.post(`http://${this.botConfig.host}:${this.botConfig.port}/text`, 
                JSON.stringify(request), {
                    headers: {'Content-Type': 'application/json'}
                }));
            return resp.data;
        } catch(e) {
            this.logger.error(`An error occured when asking chat bot`, e)
            return {
                ok: false,
                error: e
            };
        }
        
    }
}
