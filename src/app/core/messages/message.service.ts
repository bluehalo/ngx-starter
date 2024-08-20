import { EventEmitter, Injectable, inject, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { ActivatedRouteSnapshot, ResolveFn, Router, RouterStateSnapshot } from '@angular/router';

import { filterNil } from 'ngxtension/filter-nil';
import { mapArray } from 'ngxtension/map-array';
import { Observable, take } from 'rxjs';
import { catchError, filter } from 'rxjs/operators';

import { AbstractEntityService, ServiceMethod } from '../../common';
import { SocketService } from '../socket.service';
import { APP_SESSION } from '../tokens';
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
	readonly #socketService = inject(SocketService);
	readonly #session = inject(APP_SESSION);

	#newMessageCount = signal(0);

	messageReceived = new EventEmitter<Message>();

	#subscribed = 0;

	get newMessageCount() {
		return this.#newMessageCount.asReadonly();
	}

	constructor() {
		super({
			[ServiceMethod.create]: 'api/admin/message',
			[ServiceMethod.read]: 'api/admin/message',
			[ServiceMethod.update]: 'api/admin/message',
			[ServiceMethod.delete]: 'api/admin/message',
			[ServiceMethod.search]: 'api/messages'
		});

		toObservable(this.#session)
			.pipe(
				filter((session) => session.isUser()),
				take(1)
			)
			.subscribe(() => {
				this.initialize();
				this.updateNewMessageCount();
			});
	}

	mapToType(model: unknown): Message {
		return new Message(model);
	}

	recent(): Observable<Message[]> {
		return this.http.post<unknown[]>('api/messages/recent', {}, { headers: this.headers }).pipe(
			mapArray((result) => this.mapToType(result)),
			catchError((error: unknown) => this.handleError(error, []))
		);
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
		if (this.#subscribed === 0) {
			this.#socketService.emit('message:subscribe');
		}
		this.#subscribed++;
	}

	unsubscribe() {
		this.#subscribed--;

		if (this.#subscribed === 0) {
			this.#socketService.emit('message:unsubscribe');
		} else if (this.#subscribed < 0) {
			this.#subscribed = 0;
		}
	}

	initialize() {
		// Add event listeners to the websocket, across all statuses
		this.#socketService.on('message:data', this.payloadRouterFn);

		this.#socketService.on('disconnect', () => {
			this.#subscribed = 0;
		});

		if (!this.#socketService.connected()) {
			this.#socketService.on('connect', () => {
				// Register for new notifications from the websocket
				this.subscribe();
			});
		} else {
			this.subscribe();
		}

		this.messageReceived.subscribe(() => {
			this.updateNewMessageCount();
		});
	}

	private updateNewMessageCount() {
		this.recent()
			.pipe(filterNil())
			.subscribe((results) => {
				this.#newMessageCount.set(results.length);
			});
	}

	private payloadRouterFn = (payload: { message: unknown }) => {
		if (this.#subscribed > 0) {
			const message = new Message(payload.message);
			this.messageReceived.emit(message);
		}
	};
}
