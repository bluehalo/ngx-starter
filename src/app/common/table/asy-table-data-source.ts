import { DataSource } from '@angular/cdk/collections';

import isEmpty from 'lodash/isEmpty';
import { BehaviorSubject, Observable, Subscription, combineLatest } from 'rxjs';
import { debounceTime, map, switchMap, tap } from 'rxjs/operators';

import { NULL_PAGING_RESULTS, PageChange, PagingOptions, PagingResults } from '../paging.model';
import { SortChange } from '../sorting.model';
import { SessionStorageService } from '../storage/session-storage.service';

export type LoadPageFunction<T> = (options: {
	pagingOptions: PagingOptions;
	search: string;
	filter: object;
}) => Observable<PagingResults<T>>;

type State = {
	pageSize: number;
	search: string;
	sort: SortChange;
};

export class AsyTableDataSource<T> extends DataSource<T> {
	readonly sortEvent$: BehaviorSubject<SortChange>;
	readonly filterEvent$: BehaviorSubject<object>;
	readonly searchEvent$: BehaviorSubject<string>;
	readonly pageChangeEvent$: BehaviorSubject<PageChange>;
	readonly pagingResults$: BehaviorSubject<PagingResults<T>>;

	private storage = new SessionStorageService();

	private readonly reloadEvent$ = new BehaviorSubject<boolean>(true);
	private readonly loading$ = new BehaviorSubject(false);
	private subscription: Subscription;

	constructor(
		private loadPageFunc: LoadPageFunction<T>,
		public storageKey?: string,
		initialSort: SortChange = {} as SortChange,
		initialSearch = '',
		initialFilter: object = {},
		initialPageSize = 20,
		private debounceTimeMs = 100
	) {
		super();

		const state = this.loadState();

		this.sortEvent$ = new BehaviorSubject(state.sort ?? initialSort);
		this.searchEvent$ = new BehaviorSubject(state.search ?? initialSearch);
		this.filterEvent$ = new BehaviorSubject(initialFilter);
		this.pageChangeEvent$ = new BehaviorSubject({
			pageNumber: 0,
			pageSize: state.pageSize ?? initialPageSize
		});
		this.pagingResults$ = new BehaviorSubject<PagingResults<T>>(
			NULL_PAGING_RESULTS as PagingResults<T>
		);

		const param$ = combineLatest([this.searchEvent$, this.filterEvent$]);

		const pagingOptions$ = combineLatest([
			this.pageChangeEvent$,
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
				tap(() => {
					this.pageChangeEvent$.next({
						pageNumber: 0,
						pageSize: this.pageChangeEvent$.value.pageSize
					});
				}),
				switchMap(([search, filter]) =>
					pagingOptions$.pipe(
						map((pagingOptions) => ({
							pagingOptions,
							search,
							filter
						}))
					)
				),
				tap(() => {
					this.loading$.next(true);
					this.pagingResults$.next(NULL_PAGING_RESULTS as PagingResults<T>);
				}),
				debounceTime(this.debounceTimeMs),
				switchMap(({ pagingOptions, search, filter }) =>
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

	filter(filter: object) {
		this.filterEvent$.next(filter);
	}

	page(pageChange: PageChange | number) {
		if (typeof pageChange === 'number') {
			this.pageChangeEvent$.next({
				pageNumber: pageChange,
				pageSize: this.pageChangeEvent$.value.pageSize
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
				sort: this.storage.getValue(`${this.storageKey}-sort`),
				pageSize: this.storage.getValue(`${this.storageKey}-pageSize`)
			};
		}
		return {};
	}

	saveState() {
		if (this.storageKey) {
			this.storage.setValue(`${this.storageKey}-search`, this.searchEvent$.value);
			this.storage.setValue(`${this.storageKey}-sort`, this.sortEvent$.value);
			this.storage.setValue(
				`${this.storageKey}-pageSize`,
				this.pagingResults$.value.pageSize
			);
		}
	}
}
