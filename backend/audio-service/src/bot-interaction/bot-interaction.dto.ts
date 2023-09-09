export interface BotRequest {
    // [new -> old]
    context: string[];
    train_id: string;
    query: string;
}

export interface BotResponse {
    ok: boolean;
    message?: string;
    error?: string
}