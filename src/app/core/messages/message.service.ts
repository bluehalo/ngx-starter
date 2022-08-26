import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';

import { untilDestroyed, UntilDestroy } from '@ngneat/until-destroy';
import { of, BehaviorSubject, Observable } from 'rxjs';
import { catchError, filter, first, map } from 'rxjs/operators';

import { AbstractEntityService, ServiceMethod } from '../../common/abstract-entity.service';
import { SystemAlertService } from '../../common/system-alert/system-alert.service';
import { AuthorizationService } from '../auth/authorization.service';
import { SessionService } from '../auth/session.service';
import { SocketService } from '../socket.service';
import { Message } from './message.model';

@UntilDestroy()
@Injectable({
	providedIn: 'root'
})
export class MessageService extends AbstractEntityService<Message> {
	public numMessagesIndicator$: BehaviorSubject<number> = new BehaviorSubject(0);
	messageReceived: EventEmitter<Message> = new EventEmitter<Message>();
	private subscribed = 0;

	constructor(
		private sessionService: SessionService,
		private authorizationService: AuthorizationService,
		alertService: SystemAlertService,
		http: HttpClient,
		private socketService: SocketService
	) {
		super(
			{
				[ServiceMethod.create]: 'api/admin/message',
				[ServiceMethod.read]: 'api/admin/message',
				[ServiceMethod.update]: 'api/admin/message',
				[ServiceMethod.delete]: 'api/admin/message',
				[ServiceMethod.search]: 'api/messages'
			},
			http,
			alertService
		);

		this.sessionService
			.getSession()
			.pipe(
				first(() => authorizationService.isUser()),
				untilDestroyed(this)
			)
			.subscribe(() => {
				this.initialize();
				this.updateNewMessageIndicator();
			});
	}

	mapToType(model: any): Message {
		return new Message().setFromModel(model);
	}

	recent(): Observable<any[]> {
		return this.http
			.post<any>('api/messages/recent', {}, { headers: this.headers })
			.pipe(catchError((error: unknown) => this.handleError(error, [])));
	}

	dismiss(ids: string[]) {
		return this.http
			.post('api/messages/dismiss', { messageIds: ids }, { headers: this.headers })
			.pipe(catchError((error: unknown) => this.handleError(error, null)));
	}

	/**
	 * Websocket functionality for messages
	 */
	subscribe() {
		if (this.subscribed === 0) {
			this.socketService.emit('message:subscribe');
		}
		this.subscribed++;
	}

	unsubscribe() {
		this.subscribed--;

		if (this.subscribed === 0) {
			this.socketService.emit('message:unsubscribe');
		} else if (this.subscribed < 0) {
			this.subscribed = 0;
		}
	}

	initialize() {
		// Add event listeners to the websocket, across all statuses
		this.socketService.on('message:data', this.payloadRouterFn);

		this.socketService.on('disconnect', () => {
			this.subscribed = 0;
		});

		if (!this.socketService.connected()) {
			this.socketService.on('connect', () => {
				// Register for new notifications from the websocket
				this.subscribe();
			});
		} else {
			this.subscribe();
		}

		this.messageReceived.subscribe(() => {
			this.updateNewMessageIndicator();
		});
	}

	updateNewMessageIndicator() {
		this.recent()
			.pipe(filter((results) => results !== null))
			.subscribe((results) => {
				this.numMessagesIndicator$.next(results.length);
			});
	}

	private payloadRouterFn = (payload: any) => {
		if (this.subscribed > 0) {
			const message = new Message();
			message.setFromModel(payload.message);
			this.messageReceived.emit(message);
		}
	};
}
