import { Component } from '@angular/core';

import { Message, MessageType } from './message.class';
import { MessageService } from './message.service';
import * as _ from 'lodash';

@Component({
	selector: 'app-list-messages',
	templateUrl: './messages.component.html',
	styleUrls: ['./messages.component.scss']
})
export class MessagesComponent {

	messages: Message[];

	constructor(
		private messageService: MessageService
	) { }

	ngOnInit() {
		this.messages = [];

		this.messageService.messageReceived
			.subscribe(() => {
				// Redo search on a new message
				this.load();
			});
		this.load();
	}

	load() {
		this.messageService.recent()
			.subscribe((result) => {
				let messages = _.orderBy(result, ['created'], ['desc']);
				this.messages = messages as Message[];
				this.messageService.numMessagesIndicator.next(this.messages.length);
			});
	}

	dismissMessage(message: Message) {
		this.messageService.dismiss([message._id]).subscribe((result) => {
			this.load();
		});
	}

	dismissAll() {
		this.messageService.dismiss(this.messages.map((m) => m._id)).subscribe(() => {
			this.load();
		});
	}

	getTypeAlertClass(message: Message) {
		switch (MessageType[message.type].toLowerCase()) {
			case 'motd':
				return 'motd';
			case 'info':
				return 'info';
			case 'warn':
				return 'warn';
			case 'error':
				return 'error';
			default:
				return 'unknown';
		}
	}

	getTypeIcon(message: Message) {
		switch (MessageType[message.type].toLowerCase()) {
			case 'motd':
				return 'fa-check';
			case 'info':
				return 'fa-info';
			case 'warn':
				return 'fa-exclamation';
			case 'error':
				return 'fa-exclamation-triangle';
			default:
				return 'unknown';
		}
	}
}
