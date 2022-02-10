import { DataSource } from '@angular/cdk/collections';

import isEmpty from 'lodash/isEmpty';
import { combineLatest, BehaviorSubject, Observable, Subject, Subscription } from 'rxjs';
import { debounceTime, map, startWith, switchMap, tap } from 'rxjs/operators';

import {
	NULL_PAGING_RESULTS,
	PageChange,
	PagingOptions,
	PagingResults
} from '../paging/paging.model';
import { SortChange } from '../paging/sorting.model';
import { SessionStorageService } from '../storage/session-storage.service';

type LoadPageFunction<T> = (options: {
	pagingOptions: PagingOptions;
	search: string;
	filter: any;
}) => Observable<PagingResults<T>>;

type State = {
	search: string;
	sort: SortChange;
};

export class AsyTableDataSource<T> extends DataSource<T> {
	readonly sortEvent$: BehaviorSubject<SortChange>;
	readonly filterEvent$: BehaviorSubject<any>;
	readonly searchEvent$: BehaviorSubject<string>;
	readonly pagingResults$: BehaviorSubject<PagingResults<T>>;

	private storage = new SessionStorageService();

	private readonly pageChangeEvent$ = new Subject<PageChange>();
	private readonly reloadEvent$ = new BehaviorSubject<boolean>(true);
	private readonly loading$ = new BehaviorSubject(false);
	private subscription: Subscription;

	constructor(
		private loadPageFunc: LoadPageFunction<T>,
		public storageKey: string | null = null,
		initialSort: SortChange = {} as SortChange,
		initialSearch: string = '',
		initialFilter: any = {},
		public pageSize = 20,
		private debounceTimeMs = 100
	) {
		super();

		const state = this.loadState();

		this.sortEvent$ = new BehaviorSubject(state.sort ?? initialSort);
		this.searchEvent$ = new BehaviorSubject(state.search ?? initialSearch);
		this.filterEvent$ = new BehaviorSubject(initialFilter);
		this.pagingResults$ = new BehaviorSubject<PagingResults<T>>(NULL_PAGING_RESULTS);

		const param$ = combineLatest([this.searchEvent$, this.filterEvent$]);

		const pagingOptions$ = combineLatest([
			this.pageChangeEvent$.pipe(startWith({ pageNumber: 0, pageSize } as PageChange)),
			this.sortEvent$,
			this.reloadEvent$
		]).pipe(
			map(
				([pageChange, sort]) =>
					new PagingOptions(
						pageChange.pageNumber,
						pageChange.pageSize,
						0,
						0,
						sort.sortField,
						sort.sortDir
					)
			)
		);

		this.subscription = param$
			.pipe(
				switchMap(([search, filter]) =>
					pagingOptions$.pipe(map((pagingOptions) => [pagingOptions, search, filter]))
				),
				tap(() => {
					this.loading$.next(true);
					this.pagingResults$.next(NULL_PAGING_RESULTS);
				}),
				debounceTime(this.debounceTimeMs),
				switchMap(([pagingOptions, search, filter]) =>
					loadPageFunc({
						pagingOptions,
						search,
						filter
					})
				),
				tap(() => {
					this.loading$.next(false);
				})
			)
			.subscribe((pagingResults) => {
				this.pagingResults$.next(pagingResults);
			});
	}

	reload() {
		this.reloadEvent$.next(true);
	}

	sort(sort: SortChange) {
		this.sortEvent$.next(sort);
		this.saveState();
	}

	filter(filter: any) {
		this.filterEvent$.next(filter);
	}

	page(pageChange: PageChange | number) {
		if (typeof pageChange === 'number') {
			this.pageChangeEvent$.next({
				pageNumber: pageChange,
				pageSize: this.pageSize
			});
		} else {
			this.pageChangeEvent$.next(pageChange);
		}
	}

	search(search: string) {
		this.searchEvent$.next(search);
		this.saveState();
	}

	get loading(): boolean {
		return this.loading$.value;
	}

	get isFiltered(): boolean {
		return !isEmpty(this.searchEvent$.value) || !isEmpty(this.filterEvent$.value);
	}

	connect() {
		return this.pagingResults$.pipe(map((results) => results.elements));
	}

	disconnect() {
		this.saveState();
		this.subscription.unsubscribe();
	}

	loadState(): Partial<State> {
		if (this.storageKey) {
			return {
				search: this.storage.getValue(`${this.storageKey}-search`),
				sort: this.storage.getValue(`${this.storageKey}-sort`)
			};
		}
		return {};
	}

	saveState() {
		if (this.storageKey) {
			this.storage.setValue(`${this.storageKey}-search`, this.searchEvent$.value);
			this.storage.setValue(`${this.storageKey}-sort`, this.sortEvent$.value);
		}
	}
}
