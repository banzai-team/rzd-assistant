import { UploadedFile } from "src/audio/audio.dto";
import { MessageSource } from "src/conversation/conversation.enum";

export interface MessageRequest {
    source: MessageSource;
    file: UploadedFile
}