import { A11yModule } from '@angular/cdk/a11y';
import { CdkConnectedOverlay, CdkOverlayOrigin, OverlayModule } from '@angular/cdk/overlay';
import { NgClass, TitleCasePipe } from '@angular/common';
import {
	ChangeDetectionStrategy,
	Component,
	DestroyRef,
	Inject,
	Input,
	Optional,
	booleanAttribute,
	inject,
	input,
	numberAttribute,
	signal
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';

import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';

import { SearchInputComponent } from '../../../search-input/search-input.component';
import {
	AsyAbstractHeaderFilterComponent,
	AsyFilterHeaderColumnDef
} from '../asy-abstract-header-filter.component';

type BuildFilterFunction = (options: ListFilterOption[], matchAll?: boolean) => object;

type LoadOptionsFunction = () => Observable<(string | string[] | ListFilterOption)[]>;

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
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
	imports: [
		NgClass,
		SearchInputComponent,
		FormsModule,
		TitleCasePipe,
		CdkOverlayOrigin,
		CdkConnectedOverlay,
		A11yModule,
		OverlayModule,
		NgbTooltip
	],
	providers: [TitleCasePipe]
})
export class AsyHeaderListFilterComponent<T> extends AsyAbstractHeaderFilterComponent<T> {
	readonly #titleCasePipe = inject(TitleCasePipe);
	readonly #destroyRef = inject(DestroyRef);

	readonly showMatch = input(false, { transform: booleanAttribute });
	readonly showSearch = input(false, { transform: booleanAttribute });
	readonly showSearchMinOptions = input(Number.MAX_SAFE_INTEGER, {
		transform: numberAttribute
	});

	readonly optionsLoading = signal(false);

	matchAll = signal(false);

	_options: ListFilterOption[];

	search = '';

	loadOptionsFunc?: LoadOptionsFunction;

	buildFilterFunc?: BuildFilterFunction;

	constructor(
		@Inject('MAT_SORT_HEADER_COLUMN_DEF')
		@Optional()
		_columnDef: AsyFilterHeaderColumnDef
	) {
		super(_columnDef);
	}

	loadOptions() {
		if (this.loadOptionsFunc) {
			this.optionsLoading.set(true);
			this.loadOptionsFunc()
				.pipe(first(), takeUntilDestroyed(this.#destroyRef))
				.subscribe((options) => {
					this.options = options;
					this.optionsLoading.set(false);
				});
		}
	}

	_buildFilter() {
		if (this.buildFilterFunc) {
			return this.buildFilterFunc(this._options, this.matchAll());
		}

		const active = this._options.filter((o) => o.active).map((o) => o.value);
		if (active.length > 0) {
			if (this.showMatch() && this.matchAll()) {
				return { $and: active.map((a) => ({ [this.id]: a })) };
			}
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
			return { options: active, matchAll: this.matchAll() };
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

	_restoreState(state?: { matchAll: boolean; options: ListFilterOption[] }) {
		if (state) {
			this.matchAll.set(this.showMatch() && (state.matchAll ?? false));
			this._setActiveOptions(state.options);
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
					display: this.#titleCasePipe.transform(option),
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
				this._options = activeOptions.map((option) => ({ active: true, ...option }));
			}
		}
	}

	private _isStringArray(array: string[] | ListFilterOption): array is string[] {
		return Array.isArray(array) && typeof array[0] === 'string';
	}
}
