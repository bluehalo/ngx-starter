import { CdkTableModule } from '@angular/cdk/table';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { Observable } from 'rxjs';
import { filter, first, switchMap } from 'rxjs/operators';

import { DialogAction, DialogService } from '../../../../common/dialog';
import { SkipToDirective } from '../../../../common/directives/skip-to.directive';
import { PagingOptions, PagingResults } from '../../../../common/paging.model';
import { UtcDatePipe } from '../../../../common/pipes/utc-date-pipe/utc-date.pipe';
import { SearchInputComponent } from '../../../../common/search-input/search-input.component';
import { SortDirection } from '../../../../common/sorting.model';
import { SystemAlertComponent } from '../../../../common/system-alert/system-alert.component';
import { SystemAlertService } from '../../../../common/system-alert/system-alert.service';
import { AsyTableDataSource } from '../../../../common/table/asy-table-data-source';
import { AsyFilterDirective } from '../../../../common/table/filter/asy-filter.directive';
import { PaginatorComponent } from '../../../../common/table/paginator/paginator.component';
import { AsySortHeaderComponent } from '../../../../common/table/sort/asy-sort-header/asy-sort-header.component';
import { AsySortDirective } from '../../../../common/table/sort/asy-sort.directive';
import { AsyTableEmptyStateComponent } from '../../../../common/table/table-empty-state/asy-table-empty-state.component';
import { Message } from '../../../messages/message.model';
import { MessageService } from '../../../messages/message.service';

@UntilDestroy()
@Component({
	templateUrl: './list-messages.component.html',
	styleUrls: ['./list-messages.component.scss'],
	standalone: true,
	imports: [
		SkipToDirective,
		SystemAlertComponent,
		SearchInputComponent,
		RouterLink,
		CdkTableModule,
		AsySortDirective,
		AsyFilterDirective,
		AsySortHeaderComponent,
		BsDropdownModule,
		AsyTableEmptyStateComponent,
		PaginatorComponent,
		UtcDatePipe
	]
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

	private dialogService = inject(DialogService);

	constructor(
		private messageService: MessageService,
		public alertService: SystemAlertService
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
		this.dialogService
			.confirm(
				'Delete message?',
				`Are you sure you want to delete message: "${message.title}" ?`,
				'Delete'
			)
			.closed.pipe(
				first(),
				filter((result) => result?.action === DialogAction.OK),
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
		this.dialogService.alert(title, body);
	}
}
