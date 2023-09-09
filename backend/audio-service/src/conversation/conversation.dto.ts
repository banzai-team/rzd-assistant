import { ModelType } from "src/bot-interaction/bot-interaction.enum";

export interface CreateConversationRequest {
    train: string;
    modelType: ModelType;
}

export interface PageableQuery {
    size: number;
    offset: number;
}

export interface Page {
    content: any[];
    total: number;
    size: number;
    offset: number;
}