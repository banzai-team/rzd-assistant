import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RuleModelRequest, BotResponse, DefaultModelAsyncRequest } from './bot-interaction.dto';
import { ConnectionConfig } from 'src/config/configuration';
import { Observable, catchError, firstValueFrom, map } from 'rxjs';
import { ModelType } from './bot-interaction.enum';

@Injectable()
export class BotInteractionService {
    private readonly logger = new Logger(BotInteractionService.name);
    private readonly ruleModelConfig: ConnectionConfig;
    private readonly defaultModelConfig: ConnectionConfig;

    constructor(private readonly http: HttpService, configService: ConfigService,) {
        this.ruleModelConfig = configService.get('models')['rule'];
        this.defaultModelConfig = configService.get('models')['default'];
    }

    async askBot(model: ModelType, request: RuleModelRequest | DefaultModelAsyncRequest): Promise<BotResponse> | never {
        try {
            let host, port, endpoint;
            if (model === ModelType.RULE_BASED_TEXT_MODEL) {
                this.logger.debug(`Using role based model for asking...`)
                host = this.ruleModelConfig.host;
                port = this.ruleModelConfig.port;
                endpoint = this.ruleModelConfig.endpoint;
            } else {
                this.logger.debug(`Using default model for asking...`);
                host = this.defaultModelConfig.host;
                port = this.defaultModelConfig.port;
                endpoint = this.defaultModelConfig.endpoint;
            }
            this.logger.debug(`Making request to ask chat bot on http://${host}:${port}/${endpoint}...`);
            const resp = await firstValueFrom(
                this.http.post(`http://${host}:${port}/${endpoint}`, 
                request, { headers: {'Content-Type': 'application/json'}}));
            return {
                ok: true,
                message: resp.data.result
            };
        } catch(e) {
            this.logger.error(`An error occured when asking chat bot`, e)
            return {
                ok: false,
                error: e
            };
        }
        
    }
}
