export interface UploadedFile {
    buffer: Buffer;
    filename: string;
    mimetype: string;
}

export interface SavedFile {
    path: string;
}

export interface SpeechDto {
    path: string;
    mimetype?: string;
    meta?: any;
}

export interface TextDto {
    text: string;
    meta?: any;
}