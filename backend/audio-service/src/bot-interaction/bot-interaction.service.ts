import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BotRequest, BotResponse } from './bot-interaction.dto';
import { ConnectionConfig } from 'src/config/configuration';
import { Observable, catchError, firstValueFrom, map } from 'rxjs';

@Injectable()
export class BotInteractionService {
    private readonly botConfig: ConnectionConfig;

    constructor(private readonly http: HttpService, configService: ConfigService,) {
        this.botConfig = configService.get('bot');
    }

    async askBot(request: BotRequest): Promise<BotResponse> | never {
        const resp = await firstValueFrom(
            this.http.post(`http://${this.botConfig.host}:${this.botConfig.port}/chat`, 
            JSON.stringify(request), {
                headers: {'Content-Type': 'application/json'}
            }));
        return resp.data;
    }
}
