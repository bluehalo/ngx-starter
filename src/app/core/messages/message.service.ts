import { EventEmitter, Injectable, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRouteSnapshot, ResolveFn, Router, RouterStateSnapshot } from '@angular/router';

import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, filter, first } from 'rxjs/operators';

import { AbstractEntityService, ServiceMethod } from '../../common/abstract-entity.service';
import { AuthorizationService } from '../auth/authorization.service';
import { SessionService } from '../auth/session.service';
import { SocketService } from '../socket.service';
import { Message } from './message.model';

export const messageResolver: ResolveFn<Message | null> = (
	route: ActivatedRouteSnapshot,
	state: RouterStateSnapshot,
	router = inject(Router),
	service = inject(MessageService)
) => {
	const id = route.paramMap.get('id') ?? 'undefined';
	return service.read(id).pipe(catchError((error: unknown) => service.redirectError(error)));
};

@Injectable({
	providedIn: 'root'
})
export class MessageService extends AbstractEntityService<Message> {
	public numMessagesIndicator$: BehaviorSubject<number> = new BehaviorSubject(0);
	messageReceived: EventEmitter<Message> = new EventEmitter<Message>();
	private subscribed = 0;

	private sessionService = inject(SessionService);
	private authorizationService = inject(AuthorizationService);
	private socketService = inject(SocketService);

	constructor() {
		super({
			[ServiceMethod.create]: 'api/admin/message',
			[ServiceMethod.read]: 'api/admin/message',
			[ServiceMethod.update]: 'api/admin/message',
			[ServiceMethod.delete]: 'api/admin/message',
			[ServiceMethod.search]: 'api/messages'
		});

		this.sessionService
			.getSession()
			.pipe(
				first(() => this.authorizationService.isUser()),
				takeUntilDestroyed()
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
