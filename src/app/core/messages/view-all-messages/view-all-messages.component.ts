import { DOCUMENT, LowerCasePipe, NgClass } from '@angular/common';
import {
	Component,
	DestroyRef,
	HostListener,
	OnInit,
	inject,
	signal,
	viewChild
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { WINDOW } from '@ng-web-apis/common';

import { PagingOptions, SearchInputComponent, SortDirection } from '../../../common';
import { AgoDatePipe } from '../../../common/pipes';
import { SystemAlertComponent } from '../../../common/system-alert';
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
	readonly #destroyRef = inject(DestroyRef);
	readonly #messagesService = inject(MessageService);
	readonly #window = inject(WINDOW);
	readonly #document = inject(DOCUMENT);

	#pageNumber = 0;
	#loadMore = true;

	readonly searchInput = viewChild.required(SearchInputComponent);

	readonly newMessages = signal(false);
	readonly messages = signal<Message[]>([]);

	readonly messageType = MessageType;

	search = '';

	ngOnInit() {
		this.loadMessages(this.#pageNumber);
		this.#messagesService.messageReceived
			.pipe(takeUntilDestroyed(this.#destroyRef))
			.subscribe((message) => {
				this.newMessages.set(true);
			});
	}

	@HostListener('window:scroll')
	onScroll() {
		// If at the bottom of the page, load more messages
		if (
			this.#window.innerHeight + this.#window.scrollY >= this.#document.body.offsetHeight &&
			this.#loadMore
		) {
			this.#loadMore = false; // Set to false temporarily to avoid multiple loads
			this.#pageNumber++;
			this.loadMessages(this.#pageNumber);
		}
	}

	loadMessages(page: number) {
		this.#messagesService
			.search(
				new PagingOptions(page, 20, 0, 0, 'created', SortDirection.desc),
				{},
				this.search
			)
			.pipe(takeUntilDestroyed(this.#destroyRef))
			.subscribe((result) => {
				if (page === 0) {
					this.messages.set(result.elements);
				} else {
					this.messages.update((messages) => [...messages, ...result.elements]);
				}
				if (this.messages.length < result.totalSize) {
					this.#loadMore = true;
				}
			});
	}

	loadNewMessages() {
		this.newMessages.set(false);
		this.search = '';
		this.searchInput().clearSearch();
		this.#pageNumber = 0;
		this.loadMessages(this.#pageNumber);
	}

	onSearch(search: string) {
		this.search = search;
		this.#pageNumber = 0;
		this.loadMessages(this.#pageNumber);
	}
}
