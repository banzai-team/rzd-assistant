import { UploadedFile } from "src/audio/audio.dto";

export interface MessageRequest {
    conversationId: number;
    source: string;
    file: UploadedFile
}