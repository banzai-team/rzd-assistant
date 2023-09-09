export interface BotRequest {
    // [new -> old]
    context: string[];
    model: string;
    query: string;
}

export interface BotResponse {
    ok: boolean;
    message?: string;
    error?: string
}