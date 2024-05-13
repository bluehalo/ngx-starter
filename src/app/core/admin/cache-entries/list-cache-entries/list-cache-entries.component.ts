import { CdkMenu, CdkMenuItem, CdkMenuTrigger } from '@angular/cdk/menu';
import { CdkTableModule } from '@angular/cdk/table';
import { JsonPipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { Observable } from 'rxjs';
import { filter, first, switchMap } from 'rxjs/operators';

import { DialogAction, DialogService } from '../../../../common/dialog';
import { SkipToDirective } from '../../../../common/directives/skip-to.directive';
import { PagingOptions, PagingResults } from '../../../../common/paging.model';
import { AgoDatePipe } from '../../../../common/pipes/ago-date.pipe';
import { UtcDatePipe } from '../../../../common/pipes/utc-date-pipe/utc-date.pipe';
import { SearchInputComponent } from '../../../../common/search-input/search-input.component';
import { SortDirection } from '../../../../common/sorting.model';
import { SystemAlertComponent } from '../../../../common/system-alert/system-alert.component';
import { SystemAlertService } from '../../../../common/system-alert/system-alert.service';
import {
	AgoDateColumnComponent,
	AsyFilterDirective,
	AsySortDirective,
	AsySortHeaderComponent,
	AsyTableDataSource,
	AsyTableEmptyStateComponent,
	PaginatorComponent,
	TextColumnComponent
} from '../../../../common/table';
import { CacheEntriesService } from '../cache-entries.service';
import {
	CacheEntryModalComponent,
	CacheEntryModalData
} from '../cache-entry-modal/cache-entry-modal.component';
import { CacheEntry } from '../cache-entry.model';

@Component({
	standalone: true,
	templateUrl: './list-cache-entries.component.html',
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
		CdkMenuItem,
		TextColumnComponent,
		AgoDateColumnComponent
	]
})
export class ListCacheEntriesComponent implements OnInit {
	readonly #destroyRef = inject(DestroyRef);
	readonly #dialogService = inject(DialogService);
	readonly #alertService = inject(SystemAlertService);
	readonly #cacheEntriesService = inject(CacheEntriesService);

	readonly dataSource = new AsyTableDataSource<CacheEntry>(
		(request) => this.loadData(request.pagingOptions, request.search, request.filter),
		undefined,
		{
			sortField: 'ts',
			sortDir: SortDirection.desc
		}
	);

	displayedColumns = ['key', 'value', 'ts', 'actionsMenu'];

	ngOnInit() {
		this.#alertService.clearAllAlerts();
	}

	loadData(
		pagingOptions: PagingOptions,
		search: string,
		query: any
	): Observable<PagingResults<CacheEntry>> {
		return this.#cacheEntriesService.match(query, search, pagingOptions);
	}

	clearFilters() {
		this.dataSource.search('');
	}

	confirmDeleteEntry(cacheEntry: CacheEntry) {
		this.#dialogService
			.confirm(
				'Delete cache entry?',
				`Are you sure you want to delete entry: ${cacheEntry.key}?`,
				'Delete'
			)
			.closed.pipe(
				first(),
				filter((result) => result?.action === DialogAction.OK),
				switchMap(() => this.#cacheEntriesService.remove(cacheEntry.key)),
				takeUntilDestroyed(this.#destroyRef)
			)
			.subscribe({
				next: () => {
					this.#alertService.addAlert(
						`Deleted cache entry: ${cacheEntry.key}`,
						'success'
					);
					this.dataSource.reload();
				},
				error: (error: unknown) => {
					if (error instanceof HttpErrorResponse) {
						this.#alertService.addAlert(error.error.message);
					}
				}
			});
	}

	viewCacheEntry(cacheEntry: CacheEntry) {
		this.#dialogService.open<unknown, CacheEntryModalData>(CacheEntryModalComponent, {
			data: {
				cacheEntry
			}
		});
	}

	refreshCacheEntry(cacheEntry: CacheEntry) {
		// temporary flag to show that the entry is refreshing
		cacheEntry.isRefreshing = true;

		this.#cacheEntriesService
			.refresh(cacheEntry.key)
			.pipe(takeUntilDestroyed(this.#destroyRef))
			.subscribe({
				next: () => {
					this.#alertService.addAlert(
						`Refreshed cache entry: ${cacheEntry.key}`,
						'success'
					);
					cacheEntry.isRefreshing = false;
					this.dataSource.reload();
				},
				error: (error: unknown) => {
					if (error instanceof HttpErrorResponse) {
						this.#alertService.addAlert(error.error.message);
					}
					cacheEntry.isRefreshing = false;
				}
			});
	}
}
