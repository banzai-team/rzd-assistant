import { UploadedFile } from "src/audio/audio.dto";

export interface MessageRequest {
    source: string;
    file: UploadedFile
}