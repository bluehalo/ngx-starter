import { OnInit } from '@angular/core';

import cloneDeep from 'lodash/cloneDeep';

import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { debounceTime, map, switchMap, tap } from 'rxjs/operators';

import { PageChange, PagingOptions, PagingResults } from './paging.model';
import { SortChange } from './sorting.model';

export abstract class AbstractPageableDataComponent<T = any> implements OnInit {
	items: T[] = [];
	hasItems = false;

	pageSize = 20;
	pagingOptions: PagingOptions = new PagingOptions();

	debounceTime = 100;

	filters: any;
	search: string;

	loading = true;

	pageEvent$: BehaviorSubject<PageChange> = new BehaviorSubject({
		pageNumber: 0,
		pageSize: this.pageSize
	});

	sortEvent$: BehaviorSubject<SortChange> = new BehaviorSubject({} as SortChange);

	filterEvent$: BehaviorSubject<any> = new BehaviorSubject({});

	searchEvent$: BehaviorSubject<string> = new BehaviorSubject<string>(this.search);

	load$: BehaviorSubject<boolean> = new BehaviorSubject(true);

	protected constructor() {}

	ngOnInit() {
		this.searchEvent$.subscribe((search: string) => {
			this.search = search;
			this.pageEvent$.next({ pageNumber: 0, pageSize: this.pageSize });
		});

		this.filterEvent$.subscribe((filters: any) => {
			this.filters = cloneDeep(filters);
			this.pageEvent$.next({ pageNumber: 0, pageSize: this.pageSize });
		});

		combineLatest([this.load$, this.pageEvent$, this.sortEvent$])
			.pipe(
				map(([, pageChange, sortChange]: [boolean, PageChange, SortChange]) => {
					return new PagingOptions(
						pageChange.pageNumber,
						pageChange.pageSize,
						0,
						0,
						sortChange.sortField,
						sortChange.sortDir
					);
				}),
				tap((paging: PagingOptions) => {
					this.pagingOptions = paging;
				}),
				debounceTime(this.debounceTime),
				switchMap((pagingOpt: PagingOptions) => {
					this.loading = true;
					return this.loadData(pagingOpt, this.search, this.getQuery());
				})
			)
			.subscribe((result: PagingResults<T>) => {
				this.items = result.elements;
				if (this.items.length > 0) {
					this.pagingOptions.set(
						result.pageNumber,
						result.pageSize,
						result.totalPages,
						result.totalSize
					);
				} else {
					this.pagingOptions.reset();
				}

				if (!this.hasItems) {
					this.hasItems = this.items.length > 0;
				}

				this.loading = false;
			});
	}

	getQuery(): any {
		return {};
	}

	abstract loadData(
		pagingOptions: PagingOptions,
		search: string,
		query: any
	): Observable<PagingResults<T>>;
}
