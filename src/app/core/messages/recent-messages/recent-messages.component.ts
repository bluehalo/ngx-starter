import { LowerCasePipe, NgClass } from '@angular/common';
import { Component, DestroyRef, OnInit, inject, output, signal } from '@angular/core';
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
	imports: [NgClass, LowerCasePipe]
})
export class RecentMessagesComponent implements OnInit {
	readonly #destroyRef = inject(DestroyRef);
	readonly #messageService = inject(MessageService);
	readonly #router = inject(Router);

	readonly viewAllClicked = output();
	readonly loading = signal(false);

	messages: Message[] = [];

	messageType = MessageType;

	ngOnInit() {
		this.#messageService.messageReceived
			.pipe(takeUntilDestroyed(this.#destroyRef))
			.subscribe(() => {
				// Redo search on a new message
				this.load();
			});
		this.load();
	}

	load() {
		this.loading.set(true);
		this.#messageService
			.recent()
			.pipe(takeUntilDestroyed(this.#destroyRef))
			.subscribe((result) => {
				this.messages = orderBy(result, ['created'], ['desc']);
				this.loading.set(false);
			});
	}

	dismissMessage(message: Message) {
		this.#messageService
			.dismiss([message._id])
			.pipe(takeUntilDestroyed(this.#destroyRef))
			.subscribe((result) => {
				this.load();
			});
	}

	dismissAll() {
		this.#messageService
			.dismiss(this.messages.map((m) => m._id))
			.pipe(takeUntilDestroyed(this.#destroyRef))
			.subscribe(() => {
				this.load();
			});
	}

	viewAll() {
		this.#router.navigate(['/messages']).then(() => {
			this.viewAllClicked.emit();
		});
	}
}
