import { CdkMenu, CdkMenuItem } from '@angular/cdk/menu';
import { CdkTableModule } from '@angular/cdk/table';
import { JsonPipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { Observable } from 'rxjs';
import { first, switchMap } from 'rxjs/operators';

import {
	PagingOptions,
	PagingResults,
	SearchInputComponent,
	SkipToDirective,
	SortDirection
} from '../../../../common';
import { DialogService, isDialogActionOK } from '../../../../common/dialog';
import { AgoDatePipe, UtcDatePipe } from '../../../../common/pipes';
import { SystemAlertComponent, SystemAlertService } from '../../../../common/system-alert';
import {
	ActionsMenuColumnComponent,
	ActionsMenuTemplateDirective,
	AgoDateColumnComponent,
	AsyFilterDirective,
	AsyHeaderSortComponent,
	AsySortDirective,
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
		AsyHeaderSortComponent,
		AsyTableEmptyStateComponent,
		PaginatorComponent,
		JsonPipe,
		AgoDatePipe,
		UtcDatePipe,
		CdkMenu,
		CdkMenuItem,
		TextColumnComponent,
		AgoDateColumnComponent,
		ActionsMenuColumnComponent,
		ActionsMenuTemplateDirective
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
		query: object
	): Observable<PagingResults<CacheEntry>> {
		return this.#cacheEntriesService.match(pagingOptions, query, search);
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
				isDialogActionOK(),
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
		console.log(cacheEntry);
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
