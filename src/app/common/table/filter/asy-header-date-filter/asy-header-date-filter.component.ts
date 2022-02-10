import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	Inject,
	Optional
} from '@angular/core';

import { DateTime } from 'luxon';

import {
	AsyAbstractHeaderFilterComponent,
	AsyFilterHeaderColumnDef
} from '../asy-abstract-header-filter.component';
import { AsyFilterDirective } from '../asy-filter.directive';

@Component({
	selector: 'asy-header-filter[date-filter]',
	templateUrl: './asy-header-date-filter.component.html',
	styleUrls: ['./asy-header-date-filter.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class AsyHeaderDateFilterComponent extends AsyAbstractHeaderFilterComponent {
	enabled = false;
	direction = 'past';
	duration: 'hour' | 'day' | 'week' | 'month' | 'year' = 'week';
	count = 1;
	isCustom = false;
	customRange: Date[] = [];

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

	onDateFilterChange() {
		if (this.enabled) {
			super.onFilterChange();
		}
		this.changeDetectorRef.markForCheck();
	}

	_buildState() {
		if (this.enabled) {
			if (this.isCustom) {
				return {
					isCustom: true,
					customRange: this.customRange
				};
			}
			return {
				direction: this.direction,
				duration: this.duration,
				count: this.count
			};
		}
		return undefined;
	}

	_restoreState(state: any) {
		if (state) {
			this.enabled = true;
			if (state.isCustom) {
				this.isCustom = true;
				this.customRange = [new Date(state.customRange[0]), new Date(state.customRange[1])];
				this.customRange = state.customRange.map((d: any) => new Date(d));
			} else {
				this.direction = state.direction;
				this.duration = state.duration;
				this.count = state.count;
			}
			this.onFilterChange();
		}
	}

	_clearState() {
		if (this.enabled) {
			this.enabled = false;
		}
	}

	_buildFilter() {
		let $lte = DateTime.invalid('not set');
		let $gte = DateTime.invalid('not set');

		if (this.enabled) {
			if (!this.isCustom) {
				const now = DateTime.now();
				if (this.direction === 'past') {
					$gte = now.minus({ [this.duration]: this.count });
					$lte = now;
				} else {
					$gte = now;
					$lte = now.plus({ [this.duration]: this.count });
				}
				$gte = $gte.startOf(this.duration);
				$lte = $lte.endOf(this.duration);
			} else if (this.customRange?.length === 2) {
				$gte = DateTime.fromJSDate(this.customRange[0]);
				$lte = DateTime.fromJSDate(this.customRange[1]);
			}
		}
		// Normalize to start/end of day
		if (this.isCustom || this.duration !== 'hour') {
			$gte = $gte.startOf('day');
			$lte = $lte.endOf('day');
		}

		return { ...($gte.isValid && $lte.isValid && { [this.id]: { $gte, $lte } }) };
	}
}
