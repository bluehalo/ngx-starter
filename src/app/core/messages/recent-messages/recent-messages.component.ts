import { LowerCasePipe, NgClass, NgFor, NgIf } from '@angular/common';
import { Component, DestroyRef, EventEmitter, OnInit, Output, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';

import orderBy from 'lodash/orderBy';

import { Message, MessageType } from '../message.model';
import { MessageService } from '../message.service';

@Component({
	selector: 'app-recent-messages',
	templateUrl: './recent-messages.component.html',
	styleUrls: ['./recent-messages.component.scss'],
	standalone: true,
	imports: [NgIf, NgFor, NgClass, LowerCasePipe]
})
export class RecentMessagesComponent implements OnInit {
	@Output()
	readonly viewAllClicked = new EventEmitter();

	messages: Message[] = [];

	loading = false;

	messageType = MessageType;

	private destroyRef = inject(DestroyRef);
	private messageService = inject(MessageService);
	private router = inject(Router);

	ngOnInit() {
		this.messageService.messageReceived
			.pipe(takeUntilDestroyed(this.destroyRef))
			.subscribe(() => {
				// Redo search on a new message
				this.load();
			});
		this.load();
	}

	load() {
		this.loading = true;
		this.messageService
			.recent()
			.pipe(takeUntilDestroyed(this.destroyRef))
			.subscribe((result) => {
				const messages = orderBy(result, ['created'], ['desc']);
				this.messages = messages as Message[];
				this.messageService.numMessagesIndicator$.next(this.messages.length);
				this.loading = false;
			});
	}

	dismissMessage(message: Message) {
		this.messageService
			.dismiss([message._id])
			.pipe(takeUntilDestroyed(this.destroyRef))
			.subscribe((result) => {
				this.load();
			});
	}

	dismissAll() {
		this.messageService
			.dismiss(this.messages.map((m) => m._id))
			.pipe(takeUntilDestroyed(this.destroyRef))
			.subscribe(() => {
				this.load();
			});
	}

	viewAll() {
		this.router.navigate(['/messages']).then(() => {
			this.viewAllClicked.emit();
		});
	}
}
