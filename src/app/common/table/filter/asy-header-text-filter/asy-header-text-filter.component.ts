import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, Input, Optional } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { NgSelectModule } from '@ng-select/ng-select';
import escapeRegExp from 'lodash/escapeRegExp';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

import { SearchInputComponent } from '../../../search-input/search-input.component';
import {
	AsyAbstractHeaderFilterComponent,
	AsyFilterHeaderColumnDef
} from '../asy-abstract-header-filter.component';

export type TextFilterOption = 'Equals' | 'Contains' | 'Starts with' | 'Ends with';

type BuildFilterFunction = (search: string, option: TextFilterOption) => any;

@Component({
	selector: 'asy-header-filter[text-filter]',
	templateUrl: './asy-header-text-filter.component.html',
	styleUrls: ['./asy-header-text-filter.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
	imports: [BsDropdownModule, NgClass, NgSelectModule, FormsModule, SearchInputComponent]
})
export class AsyHeaderTextFilterComponent extends AsyAbstractHeaderFilterComponent {
	@Input()
	buildFilterFunc?: BuildFilterFunction;

	option: TextFilterOption = 'Contains';

	search = '';

	constructor(
		@Inject('MAT_SORT_HEADER_COLUMN_DEF')
		@Optional()
		_columnDef: AsyFilterHeaderColumnDef
	) {
		super(_columnDef);
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
			if (this.buildFilterFunc) {
				return this.buildFilterFunc(this.search, this.option);
			}

			return {
				[this.id]: { $regex: this.buildRegex(this.search, this.option), $options: 'i' }
			};
		}
		return {};
	}

	public buildRegex(search: string, option: TextFilterOption) {
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
