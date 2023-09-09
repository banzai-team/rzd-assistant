import { Injectable } from "@nestjs/common";
import { WebSocketServer } from "@nestjs/websockets";
import { WebsocketGateway } from "src/app/websocket.gateway";
import { SavedFile } from "src/audio/audio.dto";

@Injectable()
export class FileSend {

    constructor(private readonly server: WebsocketGateway) {}

    async send() {
        this.server.doSend('boooo');
    }
}