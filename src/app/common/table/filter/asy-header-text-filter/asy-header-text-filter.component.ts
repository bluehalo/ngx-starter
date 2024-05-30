import { A11yModule } from '@angular/cdk/a11y';
import { CdkConnectedOverlay, CdkOverlayOrigin, OverlayModule } from '@angular/cdk/overlay';
import { NgClass } from '@angular/common';
import {
	ChangeDetectionStrategy,
	Component,
	Inject,
	Optional,
	effect,
	signal
} from '@angular/core';
import { FormsModule } from '@angular/forms';

import { NgSelectModule } from '@ng-select/ng-select';
import escapeRegExp from 'lodash/escapeRegExp';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

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
	imports: [
		NgClass,
		NgSelectModule,
		FormsModule,
		SearchInputComponent,
		TooltipModule,
		A11yModule,
		OverlayModule,
		CdkConnectedOverlay,
		CdkOverlayOrigin
	]
})
export class AsyHeaderTextFilterComponent extends AsyAbstractHeaderFilterComponent {
	readonly search = signal('');
	option = signal<TextFilterOption>('Contains');

	buildFilterFunc?: BuildFilterFunction;

	constructor(
		@Inject('MAT_SORT_HEADER_COLUMN_DEF')
		@Optional()
		_columnDef: AsyFilterHeaderColumnDef
	) {
		super(_columnDef);
	}

	onSearchTypeChange() {
		if (this.search()) {
			this.onFilterChange();
		}
	}

	onSearchText(search: string) {
		this.search.set(search);
		this.onFilterChange();
	}

	_buildState(): { search: string; option: TextFilterOption } | undefined {
		if (this.search()) {
			return { search: this.search(), option: this.option() };
		}
		return undefined;
	}

	_restoreState(state: any) {
		if (state) {
			this.search.set(state.search);
			this.option.set(state.option);
			this.onFilterChange();
		}
	}

	_clearState() {
		this.search.set('');
		this.option.set('Contains');
	}

	_buildFilter() {
		if (this.search()) {
			if (this.buildFilterFunc) {
				return this.buildFilterFunc(this.search(), this.option());
			}

			return {
				[this.id]: { $regex: this.buildRegex(this.search(), this.option()), $options: 'i' }
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
