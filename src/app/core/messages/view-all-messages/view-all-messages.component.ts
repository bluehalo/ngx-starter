import { LowerCasePipe, NgClass, NgFor, NgIf } from '@angular/common';
import { Component, HostListener, OnInit, ViewChild } from '@angular/core';

import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { PagingOptions, PagingResults } from '../../../common/paging.model';
import { AgoDatePipe } from '../../../common/pipes/ago-date.pipe';
import { SearchInputComponent } from '../../../common/search-input/search-input.component';
import { SortDirection } from '../../../common/sorting.model';
import { SystemAlertComponent } from '../../../common/system-alert/system-alert.component';
import { Message, MessageType } from '../message.model';
import { MessageService } from '../message.service';

@UntilDestroy()
@Component({
	selector: 'app-view-all-messages',
	templateUrl: './view-all-messages.component.html',
	styleUrls: ['./view-all-messages.component.scss'],
	standalone: true,
	imports: [
		SystemAlertComponent,
		SearchInputComponent,
		NgIf,
		NgFor,
		NgClass,
		LowerCasePipe,
		AgoDatePipe
	]
})
export class ViewAllMessagesComponent implements OnInit {
	pageNumber = 0;
	messages: Message[] = [];
	loadMore = true;
	search = '';
	newMessages = false;
	messageType = MessageType;

	@ViewChild(SearchInputComponent, { static: true }) searchInput?: SearchInputComponent;

	constructor(private messagesService: MessageService) {}

	ngOnInit() {
		this.loadMessages(this.pageNumber);
		this.messagesService.messageReceived.pipe(untilDestroyed(this)).subscribe((message) => {
			this.newMessages = true;
		});
	}

	@HostListener('window:scroll')
	onScroll() {
		// If at the bottom of the page, load more messages
		if (window.innerHeight + window.scrollY >= document.body.offsetHeight && this.loadMore) {
			this.loadMore = false; // Set to false temporarily to avoid multiple loads
			this.pageNumber++;
			this.loadMessages(this.pageNumber);
		}
	}

	loadMessages(page: number) {
		this.messagesService
			.search(
				new PagingOptions(page, 20, 0, 0, 'created', SortDirection.desc),
				{},
				this.search
			)
			.pipe(untilDestroyed(this))
			.subscribe((messages: PagingResults) => {
				if (page === 0) {
					this.messages = messages.elements;
				} else {
					this.messages = this.messages.concat(messages.elements);
				}
				if (this.messages.length < messages.totalSize) {
					this.loadMore = true;
				}
			});
	}

	loadNewMessages() {
		this.newMessages = false;
		this.search = '';
		this.searchInput?.clearSearch();
		this.pageNumber = 0;
		this.loadMessages(this.pageNumber);
	}

	onSearch(search: string) {
		this.search = search;
		this.pageNumber = 0;
		this.loadMessages(this.pageNumber);
	}
}
