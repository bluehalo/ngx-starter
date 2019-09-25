import { Component, OnInit, HostListener, ViewChild } from '@angular/core';

import { PagingOptions, PagingResults, SortDirection } from 'src/app/common/paging.module';
import { SearchInputComponent } from 'src/app/common/search-input.module';

import { MessageService } from '../message.service';
import { Message } from '../message.class';

@Component({
	selector: 'app-view-all-messages',
	templateUrl: './view-all-messages.component.html',
	styleUrls: ['./view-all-messages.component.scss']
})
export class ViewAllMessagesComponent implements OnInit {

	pageNumber = 0;
	messages: Message[] = [];
	loadMore = true;
	search: string = null;
	newMessages = false;

	@ViewChild(SearchInputComponent, { static: true }) searchInput: SearchInputComponent;

	constructor(
		private messagesService: MessageService
	) { }

	ngOnInit() {
		this.loadMessages(this.pageNumber);
		this.messagesService.messageReceived.subscribe((message) => {
			this.newMessages = true;
		});
	}

	@HostListener('window:scroll')
	onScroll() {
		// If at the bottom of the page, load more messages
		if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight && this.loadMore) {
			this.loadMore = false; // Set to false temporarily to avoid multiple loads
			this.pageNumber++;
			this.loadMessages(this.pageNumber);
		}
	}

	loadMessages(page: number) {
		this.messagesService.search({}, this.search, new PagingOptions(page, 20, 0, 0, 'created', SortDirection.desc)).subscribe((messages: PagingResults) => {
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
		this.search = null;
		this.searchInput.clearSearch();
		this.pageNumber = 0;
		this.loadMessages(this.pageNumber);
	}

	onSearch(search: string) {
		this.search = search;
		this.pageNumber = 0;
		this.loadMessages(this.pageNumber);
	}

}
