import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

import { BsModalService } from 'ngx-bootstrap/modal';
import { filter, first, switchMap } from 'rxjs/operators';

import { ModalAction, ModalService } from '../../../common/modal.module';
import { PagingComponent, PagingOptions, PagingResults, SortDirection, SortableTableHeader } from '../../../common/paging.module';
import { SystemAlertService } from '../../../common/system-alert.module';

import { CacheEntry } from './cache-entry.model';
import { CacheEntriesService } from './cache-entries.service';
import { CacheEntryModalComponent } from './cache-entry-modal.component';
import { AdminTopics } from '../admin-topic.model';

@Component({
	selector: 'cache-entries',
	templateUrl: './cache-entries.component.html'
})
export class CacheEntriesComponent extends PagingComponent implements OnInit {

	cacheEntries: any[] = [];
	hasCacheEntries: boolean = false;

	search: string = '';

	headers: SortableTableHeader[] = [
		{ name: 'Key', sortField: 'key', sortDir: SortDirection.asc, sortable: true, tooltip: 'Sort by Key', default: true },
		{ name: 'Value', sortable: false },
		{ name: 'Timestamp', sortField: 'ts', sortDir: SortDirection.desc, sortable: true, tooltip: 'Sort by Timestamp' }
	];

	constructor(
		private cacheEntriesService: CacheEntriesService,
		private modalService: ModalService,
		private bsModalService: BsModalService,
		private alertService: SystemAlertService
	) { super(); }

	ngOnInit() {
		this.alertService.clearAllAlerts();

		this.pagingOpts = new PagingOptions();

		const defaultSort = this.headers.find((header: any) => header.default);
		if (null != defaultSort) {
			this.pagingOpts.sortField = defaultSort.sortField;
			this.pagingOpts.sortDir = defaultSort.sortDir;
		}

		this.loadCacheEntries();
	}

	onSearch(search: string) {
		this.search = search;
		this.applySearch();
	}

	loadData() {
		this.loadCacheEntries();
	}

	confirmDeleteEntry(cacheEntry: any) {
		const entryToDelete = cacheEntry.entry;

		this.modalService
			.confirm('Delete cache entry?', `Are you sure you want to delete entry: ${cacheEntry.entry.key}?`, 'Delete')
			.pipe(
				first(),
				filter((action: ModalAction) => action === ModalAction.OK),
				switchMap(() => {
					return this.cacheEntriesService.remove(entryToDelete.key);
				})
			)
			.subscribe(() => {
				this.alertService.addAlert(`Deleted cache entry: ${entryToDelete.key}`, 'success');
				this.loadCacheEntries();
			}, (response: HttpErrorResponse) => {
				this.alertService.addAlert(response.error.message);
			});
	}

	viewCacheEntry(cacheEntry: any) {
		const cacheEntryModalRef = this.bsModalService.show(CacheEntryModalComponent, { ignoreBackdropClick: true, class: 'modal-lg' });
		cacheEntryModalRef.content.cacheEntry = cacheEntry.entry;
	}

	refreshCacheEntry(cacheEntry: any) {
		// temporary flag to show that the entry is refreshing
		cacheEntry.isRefreshing = true;

		let key = cacheEntry.entry.key;
		this.cacheEntriesService.refresh(key).subscribe(
			() => {
				this.alertService.addAlert(`Refreshed cache entry: ${key}`, 'success');
				cacheEntry.isRefreshing = false;
				this.applySearch();
			}, (response: HttpErrorResponse) => {
				this.alertService.addAlert(response.error.message);
				cacheEntry.isRefreshing = false;
			}
		);
	}

	private loadCacheEntries() {
		this.cacheEntriesService.match({}, this.search, this.pagingOpts)
			.subscribe((result: PagingResults) => {
				this.cacheEntries = result.elements.map((element: any) => {
					return {
						entry: new CacheEntry(element.key, element.value, element.ts),
						isRefreshing: false
					};
				});
				if (this.cacheEntries.length > 0) {
					this.pagingOpts.set(result.pageNumber, result.pageSize, result.totalPages, result.totalSize);
				} else {
					this.pagingOpts.reset();
				}

				if (!this.hasCacheEntries) {
					this.hasCacheEntries = this.cacheEntries.length > 0;
				}
			},
			(response: HttpErrorResponse) => {
				this.alertService.addAlert(response.error.message);
			}
		);
	}

}

AdminTopics.registerTopic({
	id: 'cache-entries',
	title: 'Cache Entries',
	ordinal: 2,
	path: 'cacheEntries'
});
