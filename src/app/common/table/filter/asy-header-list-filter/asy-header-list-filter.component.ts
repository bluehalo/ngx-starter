import { TitleCasePipe } from '@angular/common';
import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	Inject,
	Input,
	Optional
} from '@angular/core';

import {
	AsyAbstractHeaderFilterComponent,
	AsyFilterHeaderColumnDef
} from '../asy-abstract-header-filter.component';
import { AsyFilterDirective } from '../asy-filter.directive';

type BuildFilterFunction = (options: ListFilterOption[]) => any;

export type ListFilterOption = {
	display: string;
	value: string;
	active?: boolean;
	hide?: boolean;
};

@Component({
	selector: 'asy-header-filter[list-filter]',
	templateUrl: './asy-header-list-filter.component.html',
	styleUrls: ['./asy-header-list-filter.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class AsyHeaderListFilterComponent extends AsyAbstractHeaderFilterComponent {
	_options: ListFilterOption[];

	search = '';

	@Input() showSearch = false;

	@Input()
	buildFilterFunc?: BuildFilterFunction;

	constructor(
		// `AsyFilterDirective` is not optionally injected, but just asserted manually w/ better error.
		@Optional()
		_filter: AsyFilterDirective,
		@Inject('MAT_SORT_HEADER_COLUMN_DEF')
		@Optional()
		_columnDef: AsyFilterHeaderColumnDef,
		changeDetectorRef: ChangeDetectorRef,
		private titleCasePipe: TitleCasePipe
	) {
		super(_filter, _columnDef, changeDetectorRef);
	}

	_buildFilter() {
		if (this.buildFilterFunc) {
			return this.buildFilterFunc(this._options);
		}

		const active = this._options.filter((o) => o.active).map((o) => o.value);
		if (active.length > 0) {
			return { [this.id]: { $in: active } };
		}

		return {};
	}

	_buildState() {
		const active = this._options
			.filter((o) => o.active)
			.map((option) => ({
				display: option.display,
				value: option.value
			}));
		if (active.length > 0) {
			return { options: active };
		}
		return undefined;
	}

	_clearState() {
		this.search = '';
		if (this._options) {
			for (const option of this._options) {
				option.active = false;
				option.hide = false;
			}
		}
	}

	_restoreState(state: any) {
		if (state) {
			this._setActiveOptions(state.options as ListFilterOption[]);
			this.onFilterChange();
		}
	}

	onSearchOptions(search: string) {
		this.search = search;
		this._options.forEach((option: ListFilterOption) => {
			option.hide = !(
				option.display.toUpperCase().includes(search.toUpperCase()) ||
				option.value.toUpperCase().includes(search.toUpperCase())
			);
		});
	}

	@Input()
	set options(options: (string | string[] | ListFilterOption)[]) {
		const activeOptions = this._options?.filter((option) => option.active) ?? [];
		this._options = options.map((option) => {
			if (typeof option === 'string') {
				return {
					display: this.titleCasePipe.transform(option),
					value: option,
					active: false
				} as ListFilterOption;
			}
			if (this._isStringArray(option)) {
				if (option.length > 1) {
					return {
						display: option[0],
						value: option[1],
						active: option[2] === 'true'
					} as ListFilterOption;
				}
			} else {
				return option;
			}
			throw new Error(`Invalid filter option: ${option}`);
		});

		this._setActiveOptions(activeOptions);
	}

	_setActiveOptions(activeOptions: ListFilterOption[]) {
		if (activeOptions.length > 0) {
			if (this._options?.length ?? 0 > 0) {
				activeOptions.forEach((active) => {
					const match = this._options.find((option) => option.value === active.value);
					if (match) {
						match.active = true;
					}
				});
			} else {
				this._options = activeOptions.map((option: any) => ({ active: true, ...option }));
			}
		}
	}

	private _isStringArray(array: string[] | ListFilterOption): array is string[] {
		return Array.isArray(array) && typeof array[0] === 'string';
	}
}