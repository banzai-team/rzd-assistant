export interface RuleModelRequest {
    // [new -> old]
    context: string[];
    train_id: string;
    query: string;
    
}

export interface DefaultModelAsyncRequest {
    userContext: string[];
    botContext: string[];
    query: string;
    train_id: string;
    message_id: number;
}

export interface BotResponse {
    ok: boolean;
    message?: string;
    error?: string
}