import { CdkMenu, CdkMenuItem, CdkMenuTrigger } from '@angular/cdk/menu';
import { CdkTableModule } from '@angular/cdk/table';
import { JsonPipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';

import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { Observable } from 'rxjs';
import { filter, first, switchMap } from 'rxjs/operators';

import { DialogAction, DialogService } from '../../../common/dialog';
import { SkipToDirective } from '../../../common/directives/skip-to.directive';
import { PagingOptions, PagingResults } from '../../../common/paging.model';
import { AgoDatePipe } from '../../../common/pipes/ago-date.pipe';
import { UtcDatePipe } from '../../../common/pipes/utc-date-pipe/utc-date.pipe';
import { SearchInputComponent } from '../../../common/search-input/search-input.component';
import { SortDirection } from '../../../common/sorting.model';
import { SystemAlertComponent } from '../../../common/system-alert/system-alert.component';
import { SystemAlertService } from '../../../common/system-alert/system-alert.service';
import { AsyTableDataSource } from '../../../common/table/asy-table-data-source';
import { AsyFilterDirective } from '../../../common/table/filter/asy-filter.directive';
import { PaginatorComponent } from '../../../common/table/paginator/paginator.component';
import { AsySortHeaderComponent } from '../../../common/table/sort/asy-sort-header/asy-sort-header.component';
import { AsySortDirective } from '../../../common/table/sort/asy-sort.directive';
import { AsyTableEmptyStateComponent } from '../../../common/table/table-empty-state/asy-table-empty-state.component';
import { CacheEntriesService } from './cache-entries.service';
import { CacheEntryModalComponent } from './cache-entry-modal.component';
import { CacheEntry } from './cache-entry.model';

@UntilDestroy()
@Component({
	selector: 'cache-entries',
	templateUrl: './cache-entries.component.html',
	standalone: true,
	imports: [
		SkipToDirective,
		SystemAlertComponent,
		SearchInputComponent,
		CdkTableModule,
		AsySortDirective,
		AsyFilterDirective,
		AsySortHeaderComponent,
		TooltipModule,
		AsyTableEmptyStateComponent,
		PaginatorComponent,
		JsonPipe,
		AgoDatePipe,
		UtcDatePipe,
		CdkMenu,
		CdkMenuTrigger,
		CdkMenuItem
	]
})
export class CacheEntriesComponent implements OnDestroy, OnInit {
	displayedColumns = ['key', 'value', 'ts', 'actionsMenu'];

	dataSource = new AsyTableDataSource<CacheEntry>(
		(request) => this.loadData(request.pagingOptions, request.search, request.filter),
		null,
		{
			sortField: 'ts',
			sortDir: SortDirection.desc
		}
	);

	private dialogService = inject(DialogService);

	constructor(
		private cacheEntriesService: CacheEntriesService,
		private alertService: SystemAlertService
	) {}

	ngOnInit() {
		this.alertService.clearAllAlerts();
	}

	ngOnDestroy(): void {
		this.dataSource.disconnect();
	}

	loadData(
		pagingOptions: PagingOptions,
		search: string,
		query: any
	): Observable<PagingResults<CacheEntry>> {
		return this.cacheEntriesService.match(query, search, pagingOptions);
	}

	clearFilters() {
		this.dataSource.search('');
	}

	confirmDeleteEntry(cacheEntry: CacheEntry) {
		this.dialogService
			.confirm(
				'Delete cache entry?',
				`Are you sure you want to delete entry: ${cacheEntry.key}?`,
				'Delete'
			)
			.closed.pipe(
				first(),
				filter((result) => result?.action === DialogAction.OK),
				switchMap(() => this.cacheEntriesService.remove(cacheEntry.key)),
				untilDestroyed(this)
			)
			.subscribe({
				next: () => {
					this.alertService.addAlert(`Deleted cache entry: ${cacheEntry.key}`, 'success');
					this.dataSource.reload();
				},
				error: (error: unknown) => {
					if (error instanceof HttpErrorResponse) {
						this.alertService.addAlert(error.error.message);
					}
				}
			});
	}

	viewCacheEntry(cacheEntry: CacheEntry) {
		this.dialogService.open(CacheEntryModalComponent, {
			data: {
				cacheEntry
			}
		});
	}

	refreshCacheEntry(cacheEntry: CacheEntry) {
		// temporary flag to show that the entry is refreshing
		cacheEntry.isRefreshing = true;

		this.cacheEntriesService
			.refresh(cacheEntry.key)
			.pipe(untilDestroyed(this))
			.subscribe({
				next: () => {
					this.alertService.addAlert(
						`Refreshed cache entry: ${cacheEntry.key}`,
						'success'
					);
					cacheEntry.isRefreshing = false;
					this.dataSource.reload();
				},
				error: (error: unknown) => {
					if (error instanceof HttpErrorResponse) {
						this.alertService.addAlert(error.error.message);
					}
					cacheEntry.isRefreshing = false;
				}
			});
	}
}
