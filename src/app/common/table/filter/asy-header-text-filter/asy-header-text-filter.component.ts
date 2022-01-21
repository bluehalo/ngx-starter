import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	Inject,
	Optional
} from '@angular/core';

import escapeRegExp from 'lodash/escapeRegExp';

import {
	AsyAbstractHeaderFilterComponent,
	AsyFilterHeaderColumnDef
} from '../asy-abstract-header-filter.component';
import { AsyFilterDirective } from '../asy-filter.directive';

type StringFilterOption = 'Equals' | 'Contains' | 'Starts with' | 'Ends with';

@Component({
	selector: 'asy-header-filter[text-filter]',
	templateUrl: './asy-header-text-filter.component.html',
	styleUrls: ['./asy-header-text-filter.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class AsyHeaderTextFilterComponent extends AsyAbstractHeaderFilterComponent {
	option: StringFilterOption = 'Contains';

	search = '';

	constructor(
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

	onSearchTypeChange() {
		if (this.search) {
			this.onFilterChange();
		}
	}

	onSearchText(search: string) {
		this.search = search;
		this.onFilterChange();
	}

	_buildState() {
		if (this.search) {
			return { search: this.search, option: this.option };
		}
		return undefined;
	}

	_restoreState(state: any) {
		if (state) {
			this.search = state.search;
			this.option = state.option;
			this.onFilterChange();
		}
	}

	_clearState() {
		this.search = '';
		this.option = 'Contains';
	}

	_buildFilter() {
		if (this.search) {
			return {
				[this.id]: { $regex: this._buildRegex(this.search, this.option), $options: 'i' }
			};
		}
		return {};
	}

	_buildRegex(search: string, option: StringFilterOption) {
		if (option === 'Equals') {
			return `^${escapeRegExp(search)}$`;
		}
		if (option === 'Starts with') {
			return `^${escapeRegExp(search)}`;
		}
		if (option === 'Ends with') {
			return `${escapeRegExp(search)}$`;
		}
		return escapeRegExp(search);
	}
}
