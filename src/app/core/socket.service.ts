import { Injectable } from '@angular/core';

import { untilDestroyed, UntilDestroy } from '@ngneat/until-destroy';
import * as io from 'socket.io-client';

import { AuthorizationService } from './auth/authorization.service';
import { SessionService } from './auth/session.service';

/**
 * Handles sockets for the application
 */

@UntilDestroy()
@Injectable({
	providedIn: 'root'
})
export class SocketService {
	protected socket: SocketIOClient.Socket;

	constructor(
		private authorizationService: AuthorizationService,
		private sessionService: SessionService
	) {
		// Do not autoconnect when the socket is created.  We will wait to do that ourselves once the
		// user has logged in.
		this.socket = io.connect({
			autoConnect: false
		});

		// If the user is already active, connect to the socket right away.
		if (this.authorizationService.isAuthenticated()) {
			this.socket.connect();
		}

		// Subscribe to authorization changes
		this.sessionService
			.getSession()
			.pipe(untilDestroyed(this))
			.subscribe(() => {
				if (this.authorizationService.isAuthenticated()) {
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
