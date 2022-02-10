import { ChangeDetectorRef, Component, Inject, Input, OnInit, Optional } from '@angular/core';

import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { concat, Observable, of, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map, switchMap, tap } from 'rxjs/operators';

import { AuditService } from '../../../../core/audit/audit.service';
import { User } from '../../../../core/auth/user.model';
import { PagingOptions } from '../../../paging/paging.model';
import {
	AsyAbstractHeaderFilterComponent,
	AsyFilterHeaderColumnDef
} from '../asy-abstract-header-filter.component';
import { AsyFilterDirective } from '../asy-filter.directive';
import { ListFilterOption } from '../asy-header-list-filter/asy-header-list-filter.component';

type TypeaheadFunction = (search: string) => Observable<any[]>;
type BuildFilterFunction = (selectedValue: any | null) => any;

@UntilDestroy()
@Component({
	selector: 'asy-header-filter[typeahead-filter]',
	templateUrl: './asy-header-typeahead-filter.component.html',
	styleUrls: ['./asy-header-typeahead-filter.component.scss']
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

	constructor(
		private auditService: AuditService,
		// `AsyFilterDirective` is not optionally injected, but just asserted manually w/ better error.
		@Optional()
		_filter: AsyFilterDirective,
		@Inject('MAT_SORT_HEADER_COLUMN_DEF')
		@Optional()
		_columnDef: AsyFilterHeaderColumnDef,
		changeDetectorRef: ChangeDetectorRef
	) {
		super(_filter, _columnDef, changeDetectorRef);
	}

	override ngOnInit(): void {
		super.ngOnInit();

		this.values$ = concat(
			of([] as any[]), // default items
			this.input$.pipe(
				untilDestroyed(this),
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
				})
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