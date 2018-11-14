import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';

import { BsModalRef, BsModalService } from 'ngx-bootstrap';

import { filter, first, switchMap } from 'rxjs/operators';

import { CacheEntry } from './cache-entry.model';
import { CacheEntriesService } from './cache-entries.service';
import { PagingComponent, PagingOptions, SortDirection, SortDisplayOption, TableSortOptions } from '../../../common/paging.module';
import { ModalAction, ModalService } from '../../../common/modal.module';
import { CacheEntryModalComponent } from './cache-entry-modal.component';

import { AdminTopics } from '../admin-topic.model';

@Component({
	selector: 'cache-entries',
	templateUrl: './cache-entries.component.html'
})
export class CacheEntriesComponent extends PagingComponent implements OnInit {

	cacheEntries: any[] = [];

	search: string = '';

	sortOpts: TableSortOptions = {
		key: new SortDisplayOption('Key', 'key', SortDirection.asc),
		timestamp: new SortDisplayOption('Timestamp', 'ts', SortDirection.desc)
	};

	constructor(
		private cacheEntriesService: CacheEntriesService,
		private modalService: ModalService,
		private bsModalService: BsModalService
	) { super(); }

	ngOnInit() {
		this.pagingOpts = new PagingOptions();
		this.pagingOpts.sortField = this.sortOpts['key'].sortField;
		this.pagingOpts.sortDir = this.sortOpts['key'].sortDir;

		this.loadCacheEntries();
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
				// this.alertService.addAlert(`Deleted cache entry: ${entryToDelete.key}`, 'success');
				this.loadCacheEntries();
			}, (response: Response) => {
				// this.alertService.addAlert(response.json().message);
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
				// this.alertService.addAlert(`Refreshed cache entry: ${key}`, 'success');
				cacheEntry.isRefreshing = false;
				this.applySearch();
			},
			(response: Response) => {
				// this.alertService.addAlert(response.json().message);
				cacheEntry.isRefreshing = false;
			}
		);
	}


	private loadCacheEntries() {
		this.cacheEntriesService.match({}, this.search, this.pagingOpts).subscribe(
			(result: any) => {
				if (result && Array.isArray(result.elements)) {
					this.cacheEntries = result.elements.map((element: any) => {
						return {
							entry: new CacheEntry(element.key, element.value, element.ts),
							isRefreshing: false
						};
					});
					this.pagingOpts.set(result.pageNumber, result.pageSize, result.totalPages, result.totalSize);
				} else {
					this.pagingOpts.reset();
				}
			},
			(response: Response) => {
				// this.alertService.addAlert(response.json().message);
			});
	}

}

AdminTopics.registerTopic({
	id: 'cache-entries',
	title: 'Cache Entries',
	ordinal: 2,
	path: 'cacheEntries'
});
