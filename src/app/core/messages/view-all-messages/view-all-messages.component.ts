import { LowerCasePipe, NgClass } from '@angular/common';
import { Component, DestroyRef, HostListener, OnInit, ViewChild, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { PagingOptions, PagingResults } from '../../../common/paging.model';
import { AgoDatePipe } from '../../../common/pipes/ago-date.pipe';
import { SearchInputComponent } from '../../../common/search-input/search-input.component';
import { SortDirection } from '../../../common/sorting.model';
import { SystemAlertComponent } from '../../../common/system-alert/system-alert.component';
import { Message, MessageType } from '../message.model';
import { MessageService } from '../message.service';

@Component({
	selector: 'app-view-all-messages',
	templateUrl: './view-all-messages.component.html',
	styleUrls: ['./view-all-messages.component.scss'],
	standalone: true,
	imports: [SystemAlertComponent, SearchInputComponent, NgClass, LowerCasePipe, AgoDatePipe]
})
export class ViewAllMessagesComponent implements OnInit {
	pageNumber = 0;
	messages: Message[] = [];
	loadMore = true;
	search = '';
	newMessages = false;
	messageType = MessageType;

	@ViewChild(SearchInputComponent, { static: true }) searchInput?: SearchInputComponent;

	private destroyRef = inject(DestroyRef);
	private messagesService = inject(MessageService);

	ngOnInit() {
		this.loadMessages(this.pageNumber);
		this.messagesService.messageReceived
			.pipe(takeUntilDestroyed(this.destroyRef))
			.subscribe((message) => {
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
			.pipe(takeUntilDestroyed(this.destroyRef))
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
