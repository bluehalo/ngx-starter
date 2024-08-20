import { A11yModule } from '@angular/cdk/a11y';
import { CdkConnectedOverlay, CdkOverlayOrigin, OverlayModule } from '@angular/cdk/overlay';
import { AsyncPipe, NgClass } from '@angular/common';
import { Component, DestroyRef, Inject, OnInit, Optional, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';

import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { Observable, Subject, concat, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs/operators';

import {
	AsyAbstractHeaderFilterComponent,
	AsyFilterHeaderColumnDef
} from '../asy-abstract-header-filter.component';

type TypeaheadFunction<T> = (search: string) => Observable<T[]>;
type BuildFilterFunction<T> = (selectedValue: T | null) => object;

@Component({
	selector: 'asy-header-filter[typeahead-filter]',
	templateUrl: './asy-header-typeahead-filter.component.html',
	styleUrls: ['./asy-header-typeahead-filter.component.scss'],
	standalone: true,
	imports: [
		NgClass,
		NgSelectModule,
		FormsModule,
		AsyncPipe,
		CdkOverlayOrigin,
		A11yModule,
		OverlayModule,
		CdkConnectedOverlay,
		NgbTooltip
	]
})
export class AsyHeaderTypeaheadFilterComponent<T, FilterType>
	extends AsyAbstractHeaderFilterComponent<T>
	implements OnInit
{
	readonly #destroyRef = inject(DestroyRef);

	readonly loading = signal(false);

	selectedValue: FilterType | null = null;

	input$ = new Subject<string>();
	values$: Observable<FilterType[]> = of([]);

	typeaheadFunc?: TypeaheadFunction<FilterType>;

	buildFilterFunc?: BuildFilterFunction<FilterType>;

	constructor(
		@Inject('MAT_SORT_HEADER_COLUMN_DEF')
		@Optional()
		_columnDef: AsyFilterHeaderColumnDef
	) {
		super(_columnDef);
	}

	override ngOnInit(): void {
		super.ngOnInit();

		this.values$ = concat(
			of([] as FilterType[]), // default items
			this.input$.pipe(
				debounceTime(200),
				distinctUntilChanged(),
				tap(() => {
					this.loading.set(true);
				}),
				switchMap((term: string) => {
					if (this.typeaheadFunc) {
						return this.typeaheadFunc(term);
					}
					return of([] as FilterType[]);
				}),
				tap(() => {
					this.loading.set(false);
				}),
				takeUntilDestroyed(this.#destroyRef)
			)
		);
	}

	override clearFilter() {
		this.selectedValue = null;
		super.clearFilter();
	}

	_buildFilter(): object {
		if (this.buildFilterFunc) {
			return this.buildFilterFunc(this.selectedValue);
		}

		if (this.selectedValue) {
			return {
				[this.id]: this.selectedValue
			};
		}

		return {};
	}

	_buildState(): object {
		return { selectedValue: this.selectedValue };
	}

	_clearState(): void {
		this.selectedValue = null;
	}

	_restoreState(state?: { selectedValue: FilterType }): void {
		if (state) {
			this.selectedValue = state.selectedValue;
			this.onFilterChange();
		}
	}
}
