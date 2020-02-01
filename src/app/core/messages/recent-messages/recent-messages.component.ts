import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

import orderBy from 'lodash/orderBy';

import { Message } from '../message.class';
import { MessageService } from '../message.service';

@Component({
	selector: 'app-recent-messages',
	templateUrl: './recent-messages.component.html',
	styleUrls: ['./recent-messages.component.scss']
})
export class RecentMessagesComponent implements OnInit {
	@Input() container: any;
	messages: Message[];
	loading = false;

	constructor(private messageService: MessageService, private router: Router) {}

	ngOnInit() {
		this.messages = [];

		this.messageService.messageReceived.subscribe(() => {
			// Redo search on a new message
			this.load();
		});
		this.load();
	}

	load() {
		this.loading = true;
		this.messageService.recent().subscribe(result => {
			const messages = orderBy(result, ['created'], ['desc']);
			this.messages = messages as Message[];
			this.messageService.numMessagesIndicator.next(this.messages.length);
			this.loading = false;
		});
	}

	dismissMessage(message: Message) {
		this.messageService.dismiss([message._id]).subscribe(result => {
			this.load();
		});
	}

	dismissAll() {
		this.messageService.dismiss(this.messages.map(m => m._id)).subscribe(() => {
			this.load();
		});
	}

	viewAll() {
		this.router.navigate(['/messages']).then(() => {
			this.container.hide();
		});
	}
}
