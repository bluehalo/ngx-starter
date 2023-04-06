import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';

import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Observable } from 'rxjs';
import { filter, first, switchMap } from 'rxjs/operators';

import { ModalAction } from '../../../common/modal/modal.model';
import { ModalService } from '../../../common/modal/modal.service';
import { PagingOptions, PagingResults } from '../../../common/paging.model';
import { SortDirection } from '../../../common/sorting.model';
import { SystemAlertService } from '../../../common/system-alert/system-alert.service';
import { AsyTableDataSource } from '../../../common/table/asy-table-data-source';
import { CacheEntriesService } from './cache-entries.service';
import { CacheEntryModalComponent } from './cache-entry-modal.component';
import { CacheEntry } from './cache-entry.model';

@UntilDestroy()
@Component({
	selector: 'cache-entries',
	templateUrl: './cache-entries.component.html'
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

	private modalRef: BsModalRef | null = null;

	constructor(
		private cacheEntriesService: CacheEntriesService,
		private modalService: ModalService,
		private bsModalService: BsModalService,
		private alertService: SystemAlertService
	) {}

	ngOnInit() {
		this.alertService.clearAllAlerts();
	}

	ngOnDestroy(): void {
		this.modalRef?.hide();
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
		this.modalService
			.confirm(
				'Delete cache entry?',
				`Are you sure you want to delete entry: ${cacheEntry.key}?`,
				'Delete'
			)
			.pipe(
				first(),
				filter((action) => action === ModalAction.OK),
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
		this.modalRef = this.bsModalService.show(CacheEntryModalComponent, {
			ignoreBackdropClick: true,
			class: 'modal-dialog-scrollable modal-lg',
			initialState: {
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
