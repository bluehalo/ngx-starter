import { A11yModule } from '@angular/cdk/a11y';
import { CdkConnectedOverlay, CdkOverlayOrigin, OverlayModule } from '@angular/cdk/overlay';
import { AsyncPipe, NgClass } from '@angular/common';
import { Component, DestroyRef, Inject, Input, OnInit, Optional, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';

import { NgSelectModule } from '@ng-select/ng-select';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { Observable, Subject, concat, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs/operators';

import {
	AsyAbstractHeaderFilterComponent,
	AsyFilterHeaderColumnDef
} from '../asy-abstract-header-filter.component';

type TypeaheadFunction = (search: string) => Observable<any[]>;
type BuildFilterFunction = (selectedValue: any | null) => any;

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
		TooltipModule,
		CdkOverlayOrigin,
		A11yModule,
		OverlayModule,
		CdkConnectedOverlay
	]
})
export class AsyHeaderTypeaheadFilterComponent
	extends AsyAbstractHeaderFilterComponent
	implements OnInit
{
	selectedValue: any | null = null;

	loading = false;
	input$ = new Subject<string>();
	values$: Observable<any[]> = of([]);

	@Input()
	typeaheadFunc?: TypeaheadFunction;

	@Input()
	buildFilterFunc?: BuildFilterFunction;

	private destroyRef = inject(DestroyRef);
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
			of([] as any[]), // default items
			this.input$.pipe(
				debounceTime(200),
				distinctUntilChanged(),
				tap(() => (this.loading = true)),
				switchMap((term: string) => {
					if (this.typeaheadFunc) {
						return this.typeaheadFunc(term);
					}
					return of([] as any[]);
				}),
				tap(() => {
					this.loading = false;
				}),
				takeUntilDestroyed(this.destroyRef)
			)
		);
	}

	override clearFilter() {
		this.selectedValue = null;
		super.clearFilter();
	}

	_buildFilter(): any {
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

	_buildState(): any {
		return { selectedValue: this.selectedValue };
	}

	_clearState(): void {
		this.selectedValue = null;
	}

	_restoreState(state: any): void {
		if (state) {
			this.selectedValue = state.selectedValue;
			this.onFilterChange();
		}
	}
}
