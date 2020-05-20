import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';

import { of, BehaviorSubject, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { NULL_PAGING_RESULTS, PagingOptions, PagingResults } from 'src/app/common/paging.module';
import { SystemAlertService } from '../../common/system-alert.module';
import { AuthorizationService } from '../auth/authorization.service';
import { Session } from '../auth/session.model';
import { SessionService } from '../auth/session.service';
import { SocketService } from '../socket.service';
import { Message } from './message.class';

@Injectable({
	providedIn: 'root'
})
export class MessageService {
	headers: any = { 'Content-Type': 'application/json' };

	public numMessagesIndicator: BehaviorSubject<number> = new BehaviorSubject(0);
	cache: any = {};
	messageReceived: EventEmitter<Message> = new EventEmitter<Message>();
	private subscribed = 0;

	constructor(
		private sessionService: SessionService,
		private authorizationService: AuthorizationService,
		private alertService: SystemAlertService,
		private http: HttpClient,
		private socketService: SocketService
	) {
		this.sessionService.getSession().subscribe((session: Session) => {
			if (authorizationService.isUser()) {
				this.initialize();
			}
		});
	}

	create(message: Message): Observable<Message> {
		return this.http
			.post<Message>('api/admin/message', JSON.stringify(message), { headers: this.headers })
			.pipe(
				catchError((error: HttpErrorResponse) => {
					this.alertService.addClientErrorAlert(error);
					return of(null);
				})
			);
	}

	get(id: string): Observable<Message> {
		return this.http
			.get<Message>(`api/admin/message/${id}`, { headers: this.headers })
			.pipe(
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
		return this.http
			.post(`api/admin/message/getAll`, { query, field }, { headers: this.headers })
			.pipe(
				catchError((error: HttpErrorResponse) => {
					this.alertService.addClientErrorAlert(error);
					return of(null);
				})
			);
	}

	update(message: Message): Observable<Message> {
		return this.http
			.post<Message>(`api/admin/message/${message._id}`, JSON.stringify(message), {
				headers: this.headers
			})
			.pipe(
				catchError((error: HttpErrorResponse) => {
					this.alertService.addClientErrorAlert(error);
					return of(null);
				})
			);
	}

	remove(id: string): Observable<Message> {
		return this.http
			.delete<Message>(`api/admin/message/${id}`, { headers: this.headers })
			.pipe(
				catchError((error: HttpErrorResponse) => {
					this.alertService.addClientErrorAlert(error);
					return of(null);
				})
			);
	}

	search(
		query: any,
		search: any,
		paging: PagingOptions = new PagingOptions()
	): Observable<PagingResults<Message>> {
		return this.http
			.post<PagingResults<Message>>(
				'api/messages',
				{ q: query, s: search },
				{ headers: this.headers, params: paging.toObj() }
			)
			.pipe(
				catchError((error: HttpErrorResponse) => {
					this.alertService.addClientErrorAlert(error);
					return of(NULL_PAGING_RESULTS);
				})
			);
	}

	recent(): Observable<any[]> {
		return this.http.post<any>('api/messages/recent', {}, { headers: this.headers }).pipe(
			catchError((error: HttpErrorResponse) => {
				this.alertService.addClientErrorAlert(error);
				return of(null);
			})
		);
	}

	dismiss(ids: string[]) {
		return this.http
			.post('api/messages/dismiss', { messageIds: ids }, { headers: this.headers })
			.pipe(
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
		this.recent().subscribe(results => {
			if (results !== null) {
				this.numMessagesIndicator.next(results.length);
			}
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
