import { ActivatedRoute, Params } from '@angular/router';
import { Component } from '@angular/core';

import toString from 'lodash/toString';

import { Message } from '../message.class';
import { MessageService } from '../message.service';
import {
	PagingOptions,
	SortDisplayOption,
	SortDirection,
	SortableTableHeader,
	PagingResults
} from 'src/app/common/paging.module';
import { SystemAlertService } from 'src/app/common/system-alert.module';
import { ModalService, ModalAction } from 'src/app/common/modal.module';
import { first, filter, switchMap } from 'rxjs/operators';
import { AdminTopics } from '../../admin/admin.module';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
	templateUrl: './list-messages.component.html'
})
export class ListMessagesComponent {

	messages: Message[] = [];
	hasMessages: boolean = false;
	pagingOpts: PagingOptions;
	search: string = '';
	filters: any = {};
	sort: any;

	headers: SortableTableHeader[] = [
		{ name: 'Title', sortField: 'title', sortDir: SortDirection.asc, sortable: true },
		{ name: 'Type', sortField: 'type', sortDir: SortDirection.asc, sortable: true },
		{ name: 'Created', sortField: 'created', sortDir: SortDirection.desc, sortable: true },
		{ name: 'Updated', sortField: 'updated', sortDir: SortDirection.desc, sortable: true, default: true }
	];

	constructor(
		private messageService: MessageService,
		public alertService: SystemAlertService,
		private modalService: ModalService,
		private route: ActivatedRoute) {
	}

	ngOnInit() {
		this.alertService.clearAllAlerts();
		this.route.params.subscribe((params: Params) => {
			if (toString(params[`clearCachedFilter`]) === 'true' || null == this.messageService.cache.listMessages) {
				this.messageService.cache.listMessages = {};
			}

			this.initializeMessageFilters();
			this.applySearch();
		});
	}

	/**
	 * Initialize query, search, and paging options, possibly from cached user settings
	 */
	initializeMessageFilters() {
		let cachedFilter: any = this.messageService.cache.listMessages as any;

		this.search = cachedFilter.search ? cachedFilter.search : '';
		this.filters = cachedFilter.filters ? cachedFilter.filters : {};

		if (cachedFilter.paging) {
			this.pagingOpts = cachedFilter.paging;
		}
		else {
			this.pagingOpts = new PagingOptions();
			this.pagingOpts.pageSize = 20;
			this.pagingOpts.sortField = 'created';
			this.pagingOpts.sortDir = SortDirection.desc;
		}
	}

	onSearch(search: string) {
		this.search = search;
		this.applySearch();
	}

	applySearch() {
		this.messageService.cache.messages = {search: this.search, paging: this.pagingOpts};
		this.messageService.search({}, this.search, this.pagingOpts)
			.subscribe((result: PagingResults) => {
				this.messages = result.elements;
				if (this.messages.length > 0) {
					this.pagingOpts.set(result.pageNumber, result.pageSize, result.totalPages, result.totalSize);
				} else {
					this.pagingOpts.reset();
				}

				if (!this.hasMessages) {
					this.hasMessages = this.messages.length > 0;
				}
			}, (error) => {
				this.alertService.addAlert(error.message);
			}
		);
	}

	goToPage(event: any) {
		this.pagingOpts.update(event.pageNumber, event.pageSize);
		this.applySearch();
	}

	setSort(sortOpt: SortDisplayOption) {
		this.pagingOpts.sortField = sortOpt.sortField;
		this.pagingOpts.sortDir = sortOpt.sortDir;
		this.applySearch();
	}

	confirmDeleteMessage(message: Message) {
		const id = message._id;

		this.modalService
			.confirm('Delete message?', `Are you sure you want to delete message: "${message.title}" ?`, 'Delete')
			.pipe(
				first(),
				filter((action: ModalAction) => action === ModalAction.OK),
				switchMap(() => {
					return this.messageService.remove(id);
				})
			)
			.subscribe(() => {
				this.alertService.addAlert(`Deleted message.`, 'success');
				this.applySearch();
			}, (error: HttpErrorResponse) => {
				this.alertService.addAlert(error.message);
			});
	}

}

AdminTopics.registerTopic({
	id: 'messages',
	title: 'Messages',
	ordinal: 5,
	path: 'messages'
});
