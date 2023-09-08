export interface UploadedFile {
    buffer: Buffer;
    filename: string;
    mimetype: string;
}

export interface Speech {
    buffer: Buffer;
    filename: string;
    mimetype: string;
    meta: any;
}

export interface Text {
    text: string;
    meta: any;
}