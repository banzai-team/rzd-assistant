export interface BotRequest {
    context: string[];
    model: string;
    message: string;
}

export interface BotResponse {
    ok: boolean;
    message?: string;
    error?: string
}