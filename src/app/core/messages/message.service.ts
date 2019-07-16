import { Injectable, EventEmitter } from '@angular/core';

import { Message } from './message.class';
import { SocketService } from '../socket.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { PagingOptions } from 'src/app/common/paging.module';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { SystemAlertService } from '../../common/system-alert.module';


@Injectable()
export class MessageService {
	headers: any = { 'Content-Type': 'application/json' };

	public numMessagesIndicator: BehaviorSubject<number> = new BehaviorSubject(0);
	cache: any = {};
	messageReceived: EventEmitter<Message> = new EventEmitter<Message>();
	private subscribed: number = 0;

	constructor(
		private alertService: SystemAlertService,
		private http: HttpClient,
		private socketService: SocketService,
	) {
		this.initialize();
	}

	create(message: Message) {
		return this.http.post(
			'api/admin/message',
			JSON.stringify(message),
			{ headers: this.headers }
		).pipe(
			catchError((error: HttpErrorResponse) => {
				this.alertService.addClientErrorAlert(error);
				return of(null);
			})
		);
	}

	get(id: string) {
		return this.http.get(
			`api/admin/message/${id}`,
			{ headers: this.headers }
		).pipe(
			catchError((error: HttpErrorResponse) => {
				this.alertService.addClientErrorAlert(error);
				return of(null);
			})
		);
	}

	/**
	 * Retrieves an array of a field's value for all messages in the system
	 */
	getAll(query: any, field: any) {
		return this.http.post(
			`api/admin/message/getAll`,
			{ query: query, field: field },
			{ headers: this.headers }
		).pipe(
			catchError((error: HttpErrorResponse) => {
				this.alertService.addClientErrorAlert(error);
				return of(null);
			})
		);
	}

	update(message: Message) {
		return this.http.post(
			`api/admin/message/${message._id}`,
			JSON.stringify(message),
			{ headers: this.headers }
		).pipe(
			catchError((error: HttpErrorResponse) => {
				this.alertService.addClientErrorAlert(error);
				return of(null);
			})
		);
	}

	remove(id: string) {
		return this.http.delete(
			`api/admin/message/${id}`,
			{ headers: this.headers }
		).pipe(
			catchError((error: HttpErrorResponse) => {
				this.alertService.addClientErrorAlert(error);
				return of(null);
			})
		);
	}

	search(query: any, search: any, paging: PagingOptions = new PagingOptions()) {
		return this.http.post(
			'api/messages',
			{ q: query, s: search },
			{ headers: this.headers, params: paging.toObj() },
		).pipe(
			catchError((error: HttpErrorResponse) => {
				this.alertService.addClientErrorAlert(error);
				return of(null);
			})
		);
	}

	recent(): Observable<any[]> {
		return this.http.post<any>(
			'api/messages/recent',
			{},
			{ headers: this.headers }
		).pipe(
			catchError((error: HttpErrorResponse) => {
				this.alertService.addClientErrorAlert(error);
				return of(null);
			})
		);
	}

	dismiss(ids: string[]) {
		return this.http.post(
			'api/messages/dismiss',
			{ messageIds: ids },
			{ headers: this.headers }
		).pipe(
			catchError((error: HttpErrorResponse) => {
				this.alertService.addClientErrorAlert(error);
				return of(null);
			})
		);
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
		}
		else if (this.subscribed < 0) {
			this.subscribed = 0;
		}
	}

	initialize() {
		// Add event listeners to the websocket, across all statuses
		this.socketService.on('message:data', this.payloadRouterFn);

		this.socketService.on('disconnect', () => {
			this.subscribed = 0;
		});

		this.socketService.on('connect', () => {
			// Register for new notifications from the websocket
			this.subscribe();
		});

		this.messageReceived
			.subscribe(() => {
				this.updateNewMessageIndicator();
			});
	}

	updateNewMessageIndicator() {
		this.recent().subscribe((results) => {
			if (results !== null) {
				this.numMessagesIndicator.next(results.length);
			}
		});
	}

	private payloadRouterFn = (payload: any) => {
		if (this.subscribed > 0) {
			let message = new Message();
			message.setFromModel(payload.message);
			this.messageReceived.emit(message);
		}
	}

}
