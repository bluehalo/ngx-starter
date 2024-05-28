import { CdkMenu, CdkMenuItem } from '@angular/cdk/menu';
import { CdkTableModule } from '@angular/cdk/table';
import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';

import { Observable } from 'rxjs';
import { filter, first, switchMap } from 'rxjs/operators';

import { CdkMenuItemRouterLinkDirective } from '../../../../common/cdk-menu-item-router-link.directive';
import { DialogAction, DialogService } from '../../../../common/dialog';
import { SkipToDirective } from '../../../../common/directives/skip-to.directive';
import { PagingOptions, PagingResults } from '../../../../common/paging.model';
import { SearchInputComponent } from '../../../../common/search-input/search-input.component';
import { SortDirection } from '../../../../common/sorting.model';
import { SystemAlertComponent } from '../../../../common/system-alert/system-alert.component';
import { SystemAlertService } from '../../../../common/system-alert/system-alert.service';
import {
	AsyFilterDirective,
	AsySortDirective,
	AsySortHeaderComponent,
	AsyTableDataSource,
	AsyTableEmptyStateComponent,
	DateColumnComponent,
	PaginatorComponent,
	TextColumnComponent
} from '../../../../common/table';
import {
	ActionsMenuColumnComponent,
	ActionsMenuTemplateDirective
} from '../../../../common/table/actions-menu-column/actions-menu-column.component';
import { Message } from '../../../messages/message.model';
import { MessageService } from '../../../messages/message.service';

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
		AsyTableEmptyStateComponent,
		PaginatorComponent,
		CdkMenu,
		CdkMenuItem,
		CdkMenuItemRouterLinkDirective,
		TextColumnComponent,
		DateColumnComponent,
		ActionsMenuColumnComponent,
		ActionsMenuTemplateDirective
	]
})
export class ListMessagesComponent implements OnInit {
	readonly #destroyRef = inject(DestroyRef);
	readonly #dialogService = inject(DialogService);
	readonly #messageService = inject(MessageService);
	readonly #alertService = inject(SystemAlertService);

	readonly dataSource = new AsyTableDataSource<Message>(
		(request) => this.loadData(request.pagingOptions, request.search, request.filter),
		'list-messages-component',
		{
			sortField: 'title',
			sortDir: SortDirection.asc
		}
	);

	displayedColumns = ['title', 'type', 'body', 'created', 'updated', 'actionsMenu'];

	ngOnInit() {
		this.#alertService.clearAllAlerts();
	}

	clearFilters() {
		this.dataSource.search('');
	}

	loadData(
		pagingOptions: PagingOptions,
		search: string,
		query: any
	): Observable<PagingResults<Message>> {
		return this.#messageService.search(pagingOptions, query, search);
	}

	confirmDeleteMessage(message: Message) {
		this.#dialogService
			.confirm(
				'Delete message?',
				`Are you sure you want to delete message: "${message.title}" ?`,
				'Delete'
			)
			.closed.pipe(
				first(),
				filter((result) => result?.action === DialogAction.OK),
				switchMap(() => this.#messageService.delete(message)),
				takeUntilDestroyed(this.#destroyRef)
			)
			.subscribe(() => {
				this.#alertService.addAlert(`Deleted message.`, 'success');
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
		this.#dialogService.alert(title, body);
	}
}
