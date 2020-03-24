import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Params } from '@angular/router';

import { Observable } from 'rxjs';
import { first, filter, switchMap } from 'rxjs/operators';
import toString from 'lodash/toString';

import {
	PagingOptions,
	SortDirection,
	SortableTableHeader,
	PagingResults,
	AbstractPageableDataComponent,
	SortChange
} from 'src/app/common/paging.module';
import { SystemAlertService } from 'src/app/common/system-alert.module';
import { ModalService, ModalAction } from 'src/app/common/modal.module';

import { Message } from '../../messages/message.class';
import { MessageService } from '../../messages/message.service';

@Component({
	templateUrl: './list-messages.component.html'
})
export class ListMessagesComponent extends AbstractPageableDataComponent<Message>
	implements OnInit {
	filters: any = {};
	sort: any;

	headers: SortableTableHeader[] = [
		{ name: 'Title', sortField: 'title', sortDir: SortDirection.asc, sortable: true },
		{ name: 'Type', sortField: 'type', sortDir: SortDirection.asc, sortable: true },
		{ name: 'Created', sortField: 'created', sortDir: SortDirection.desc, sortable: true },
		{
			name: 'Updated',
			sortField: 'updated',
			sortDir: SortDirection.desc,
			sortable: true,
			default: true
		}
	];

	constructor(
		private messageService: MessageService,
		public alertService: SystemAlertService,
		private modalService: ModalService,
		private route: ActivatedRoute
	) {
		super();
	}

	ngOnInit() {
		this.alertService.clearAllAlerts();
		this.route.params.subscribe((params: Params) => {
			if (
				toString(params[`clearCachedFilter`]) === 'true' ||
				null == this.messageService.cache.listMessages
			) {
				this.messageService.cache.listMessages = {};
			}

			this.sortEvent$.next(this.headers.find((header: any) => header.default) as SortChange);

			this.initializeFromCache();

			super.ngOnInit();
		});
	}

	/**
	 * Initialize query, search, and paging options, possibly from cached user settings
	 */
	private initializeFromCache() {
		const cachedFilter = this.messageService.cache.listMessages;

		this.searchEvent$.next(cachedFilter.search);

		if (cachedFilter.paging) {
			this.pageEvent$.next(cachedFilter.paging);
			this.sortEvent$.next(cachedFilter.paging);
		}
	}

	loadData(
		pagingOptions: PagingOptions,
		search: string,
		query: any
	): Observable<PagingResults<Message>> {
		this.messageService.cache.messages = { search, paging: pagingOptions };

		return this.messageService.search(query, search, pagingOptions);
	}

	confirmDeleteMessage(message: Message) {
		const id = message._id;

		this.modalService
			.confirm(
				'Delete message?',
				`Are you sure you want to delete message: "${message.title}" ?`,
				'Delete'
			)
			.pipe(
				first(),
				filter(action => action === ModalAction.OK),
				switchMap(() => this.messageService.remove(id))
			)
			.subscribe(
				() => {
					this.alertService.addAlert(`Deleted message.`, 'success');
					this.load$.next(true);
				},
				(error: HttpErrorResponse) => {
					this.alertService.addAlert(error.message);
				}
			);
	}
}
