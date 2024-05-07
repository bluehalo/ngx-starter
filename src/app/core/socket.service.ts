import { Injectable, effect, inject } from '@angular/core';

import * as io from 'socket.io-client';

import { APP_SESSION } from './tokens';

/**
 * Handles sockets for the application
 */
@Injectable({
	providedIn: 'root'
})
export class SocketService {
	protected socket: SocketIOClient.Socket;

	#session = inject(APP_SESSION);

	constructor() {
		// Do not auto connect when the socket is created.  We will wait to do that ourselves once the
		// user has logged in.
		this.socket = io.connect({
			autoConnect: false
		});

		// If the user is already active, connect to the socket right away.
		if (this.#session().isAuthenticated()) {
			this.socket.connect();
		}

		// Subscribe to authorization changes
		effect(() => {
			if (this.#session().isAuthenticated()) {
				// enable sockets/messaging
				this.socket.connect();
			} else {
				this.socket.disconnect();
			}
		});
	}

	public on(eventName: string, callback: (event: any) => void) {
		this.socket.on(eventName, (event: any) => {
			callback.apply(this.socket, [event]);
		});
	}

	public emit(eventName: string) {
		this.socket.emit(eventName);
	}

	public connected(): boolean {
		return this.socket.connected;
	}
}
