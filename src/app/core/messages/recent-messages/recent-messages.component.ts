import { LowerCasePipe, NgClass, NgFor, NgIf } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import orderBy from 'lodash/orderBy';

import { Message, MessageType } from '../message.model';
import { MessageService } from '../message.service';

@UntilDestroy()
@Component({
	selector: 'app-recent-messages',
	templateUrl: './recent-messages.component.html',
	styleUrls: ['./recent-messages.component.scss'],
	standalone: true,
	imports: [NgIf, NgFor, NgClass, LowerCasePipe]
})
export class RecentMessagesComponent implements OnInit {
	@Input() container: any;
	messages: Message[] = [];
	loading = false;

	messageType = MessageType;

	constructor(
		private messageService: MessageService,
		private router: Router
	) {}

	ngOnInit() {
		this.messageService.messageReceived.pipe(untilDestroyed(this)).subscribe(() => {
			// Redo search on a new message
			this.load();
		});
		this.load();
	}

	load() {
		this.loading = true;
		this.messageService
			.recent()
			.pipe(untilDestroyed(this))
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
			.pipe(untilDestroyed(this))
			.subscribe((result) => {
				this.load();
			});
	}

	dismissAll() {
		this.messageService
			.dismiss(this.messages.map((m) => m._id))
			.pipe(untilDestroyed(this))
			.subscribe(() => {
				this.load();
			});
	}

	viewAll() {
		this.router.navigate(['/messages']).then(() => {
			this.container.hide();
		});
	}
}
