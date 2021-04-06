import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

import { ModalAction, ModalService } from '../../../common/modal.module';
import {
	AbstractPageableDataComponent,
	PagingOptions,
	PagingResults,
	SortableTableHeader,
	SortChange,
	SortDirection
} from '../../../common/paging.module';
import { SystemAlertService } from '../../../common/system-alert.module';

import { untilDestroyed, UntilDestroy } from '@ngneat/until-destroy';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Observable } from 'rxjs';
import { filter, first, switchMap } from 'rxjs/operators';
import { CacheEntriesService } from './cache-entries.service';
import { CacheEntryModalComponent } from './cache-entry-modal.component';
import { CacheEntry } from './cache-entry.model';

@UntilDestroy()
@Component({
	selector: 'cache-entries',
	templateUrl: './cache-entries.component.html'
})
export class CacheEntriesComponent extends AbstractPageableDataComponent<CacheEntry>
	implements OnInit {
	headers: SortableTableHeader[] = [
		{
			name: 'Key',
			sortable: true,
			sortField: 'key',
			sortDir: SortDirection.asc,
			tooltip: 'Sort by Key',
			default: true
		},
		{ name: 'Value', sortable: false },
		{
			name: 'Timestamp',
			sortable: true,
			sortField: 'ts',
			sortDir: SortDirection.desc,
			tooltip: 'Sort by Timestamp'
		}
	];

	constructor(
		private cacheEntriesService: CacheEntriesService,
		private modalService: ModalService,
		private bsModalService: BsModalService,
		private alertService: SystemAlertService
	) {
		super();
	}

	ngOnInit() {
		this.alertService.clearAllAlerts();

		this.sortEvent$.next(this.headers.find((header: any) => header.default) as SortChange);

		super.ngOnInit();
	}

	loadData(
		pagingOptions: PagingOptions,
		search: string,
		query: any
	): Observable<PagingResults<CacheEntry>> {
		return this.cacheEntriesService.match(query, search, pagingOptions);
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
				filter(action => action === ModalAction.OK),
				switchMap(() => this.cacheEntriesService.remove(cacheEntry.key)),
				untilDestroyed(this)
			)
			.subscribe(
				() => {
					this.alertService.addAlert(`Deleted cache entry: ${cacheEntry.key}`, 'success');
					this.load$.next(true);
				},
				(response: HttpErrorResponse) => {
					this.alertService.addAlert(response.error.message);
				}
			);
	}

	viewCacheEntry(cacheEntry: CacheEntry) {
		const cacheEntryModalRef = this.bsModalService.show(CacheEntryModalComponent, {
			ignoreBackdropClick: true,
			class: 'modal-dialog-scrollable modal-lg'
		});
		cacheEntryModalRef.content.cacheEntry = cacheEntry;
	}

	refreshCacheEntry(cacheEntry: CacheEntry) {
		// temporary flag to show that the entry is refreshing
		cacheEntry.isRefreshing = true;

		this.cacheEntriesService
			.refresh(cacheEntry.key)
			.pipe(untilDestroyed(this))
			.subscribe(
				() => {
					this.alertService.addAlert(
						`Refreshed cache entry: ${cacheEntry.key}`,
						'success'
					);
					cacheEntry.isRefreshing = false;
					this.load$.next(true);
				},
				(response: HttpErrorResponse) => {
					this.alertService.addAlert(response.error.message);
					cacheEntry.isRefreshing = false;
				}
			);
	}
}
