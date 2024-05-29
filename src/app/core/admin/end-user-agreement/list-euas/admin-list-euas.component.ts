import { CdkMenu, CdkMenuItem } from '@angular/cdk/menu';
import { CdkTableModule } from '@angular/cdk/table';
import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';

import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { Observable } from 'rxjs';
import { filter, first, switchMap } from 'rxjs/operators';

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
	ColumnChooserComponent,
	DateColumnComponent,
	PaginatorComponent,
	SidebarComponent,
	TextColumnComponent
} from '../../../../common/table';
import {
	ActionsMenuColumnComponent,
	ActionsMenuTemplateDirective
} from '../../../../common/table/actions-menu-column/actions-menu-column.component';
import { EndUserAgreement } from '../eua.model';
import { EuaService } from '../eua.service';

@Component({
	templateUrl: './admin-list-euas.component.html',
	styleUrls: ['./admin-list-euas.component.scss'],
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
		SidebarComponent,
		ColumnChooserComponent,
		PaginatorComponent,
		TooltipModule,
		CdkMenu,
		CdkMenuItem,
		TextColumnComponent,
		DateColumnComponent,
		ActionsMenuColumnComponent,
		ActionsMenuTemplateDirective
	]
})
export class AdminListEuasComponent implements OnInit {
	readonly #destroyRef = inject(DestroyRef);
	readonly #dialogService = inject(DialogService);
	readonly #euaService = inject(EuaService);
	readonly #alertService = inject(SystemAlertService);

	readonly displayedColumns = signal<string[]>([]);

	readonly columns = [
		{
			key: '_id',
			label: 'ID',
			selected: false
		},
		{
			key: 'title',
			label: 'Title',
			selected: true
		},
		{
			key: 'text',
			label: 'Text',
			selected: false
		},
		{
			key: 'created',
			label: 'Created',
			selected: true
		},
		{
			key: 'published',
			label: 'Published',
			selected: true
		},
		{
			key: 'updated',
			label: 'Updated',
			selected: true
		}
	];

	readonly dataSource = new AsyTableDataSource<EndUserAgreement>(
		(request) => this.loadData(request.pagingOptions, request.search, request.filter),
		'admin-list-euas-component',
		{
			sortField: 'displayName',
			sortDir: SortDirection.asc
		}
	);

	ngOnInit() {
		this.#alertService.clearAllAlerts();
		this.columnsChanged(this.columns.filter((c) => c.selected).map((c) => c.key));
	}

	columnsChanged(columns: string[]) {
		this.displayedColumns.set([...columns, 'actionsMenu']);
	}

	clearFilters() {
		this.dataSource.search('');
	}

	confirmDeleteEua(eua: EndUserAgreement) {
		this.#dialogService
			.confirm(
				'Delete End User Agreement?',
				`Are you sure you want to delete eua: "${eua.title}" ?`,
				'Delete'
			)
			.closed.pipe(
				first(),
				filter((result) => result?.action === DialogAction.OK),
				switchMap(() => this.#euaService.delete(eua)),
				takeUntilDestroyed(this.#destroyRef)
			)
			.subscribe(() => {
				this.#alertService.addAlert(`Deleted EUA entitled: ${eua.title}`, 'success');
				this.dataSource.reload();
			});
	}

	publishEua(eua: EndUserAgreement) {
		this.#euaService
			.publish(eua)
			.pipe(takeUntilDestroyed(this.#destroyRef))
			.subscribe(() => {
				this.#alertService.addAlert(`Published ${eua.title}`, 'success');
				this.dataSource.reload();
			});
	}

	loadData(
		pagingOptions: PagingOptions,
		search: string,
		query: any
	): Observable<PagingResults<EndUserAgreement>> {
		return this.#euaService.search(pagingOptions, query, search);
	}

	/**
	 * Opens a preview modal containing the text and title of this end user agreement.
	 *
	 * @param endUserAgreement - the end user agreement used to populate the modal
	 */
	previewEndUserAgreement(endUserAgreement: any) {
		const { text, title } = endUserAgreement;
		this.#dialogService.alert(title, text);
	}
}
