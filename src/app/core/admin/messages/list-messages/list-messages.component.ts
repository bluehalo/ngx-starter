import { Component, OnDestroy, OnInit } from '@angular/core';

import { untilDestroyed, UntilDestroy } from '@ngneat/until-destroy';
import { Observable } from 'rxjs';
import { filter, first, switchMap } from 'rxjs/operators';

import { ModalAction } from '../../../../common/modal/modal.model';
import { ModalService } from '../../../../common/modal/modal.service';
import { PagingOptions, PagingResults, SortDirection } from '../../../../common/paging.module';
import { SystemAlertService } from '../../../../common/system-alert/system-alert.service';
import { AsyTableDataSource } from '../../../../common/table/asy-table-data-source';
import { Message } from '../../../messages/message.model';
import { MessageService } from '../../../messages/message.service';

@UntilDestroy()
@Component({
	templateUrl: './list-messages.component.html',
	styleUrls: ['./list-messages.component.scss']
})
export class ListMessagesComponent implements OnDestroy, OnInit {
	displayedColumns = ['title', 'type', 'created', 'updated', 'actionsMenu'];

	dataSource = new AsyTableDataSource<Message>(
		(request) => this.loadData(request.pagingOptions, request.search, request.filter),
		'list-messages-component',
		{
			sortField: 'title',
			sortDir: SortDirection.asc
		}
	);

	constructor(
		private messageService: MessageService,
		public alertService: SystemAlertService,
		private modalService: ModalService
	) {}

	ngOnInit() {
		this.alertService.clearAllAlerts();
	}

	ngOnDestroy() {
		this.dataSource.disconnect();
	}

	clearFilters() {
		this.dataSource.search('');
	}

	loadData(
		pagingOptions: PagingOptions,
		search: string,
		query: any
	): Observable<PagingResults<Message>> {
		return this.messageService.search(pagingOptions, query, search);
	}

	confirmDeleteMessage(message: Message) {
		this.modalService
			.confirm(
				'Delete message?',
				`Are you sure you want to delete message: "${message.title}" ?`,
				'Delete'
			)
			.pipe(
				first(),
				filter((action) => action === ModalAction.OK),
				switchMap(() => this.messageService.delete(message)),
				untilDestroyed(this)
			)
			.subscribe(() => {
				this.alertService.addAlert(`Deleted message.`, 'success');
				this.dataSource.reload();
			});
	}

	/**
	 * Opens a preview modal containing the body and title of this message.
	 *
	 * @param message - the message used to populate the modal
	 */
	previewMessage(message: Message) {
		const { body, title } = message;
		this.modalService.alert(title, body);
	}
}
