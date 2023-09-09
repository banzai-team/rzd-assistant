export interface CreateConversationRequest {
    train: string;
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