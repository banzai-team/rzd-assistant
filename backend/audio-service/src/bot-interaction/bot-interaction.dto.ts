export interface BotRequest {
    // [new -> old]
    context: string[];
    train_id: string;
    query: string;
    message_id?: number;
}

export interface BotResponse {
    ok: boolean;
    message?: string;
    error?: string
}