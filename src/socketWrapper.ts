import * as base64 from 'base64-js';
import { TextEncoderLite, TextDecoderLite } from 'text-encoder-lite-module';
import { SocketWrapper } from "mpc-js-core";

export class WebSocketWrapper implements SocketWrapper {

	private url: string;
	private textEncoder: TextEncoderLite;
	private textDecoder: TextDecoderLite;
	private wsClient: WebSocket;
	
	constructor(url: string) {
		this.url = url;
		this.textEncoder = new TextEncoderLite();
		this.textDecoder = new TextDecoderLite();
	}

	connect(receive: (msg: string) => void) {
		this.wsClient = new WebSocket(this.url, ['base64']);
		this.wsClient.onmessage = (e) => receive(this.textDecoder.decode(base64.toByteArray(e.data)));
	}

	send(msg: string) {
		this.wsClient.send(base64.fromByteArray(this.textEncoder.encode(msg)));
	}

	disconnect() {
		this.wsClient.close();
	}
}
