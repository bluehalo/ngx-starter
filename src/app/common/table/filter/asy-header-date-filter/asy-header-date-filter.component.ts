import { A11yModule } from '@angular/cdk/a11y';
import { CdkConnectedOverlay, CdkOverlayOrigin, OverlayModule } from '@angular/cdk/overlay';
import { TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, Optional, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { NgbInputDatepicker, NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { DateTime } from 'luxon';

import { DatepickerRangePopupComponent } from '../../../datepicker';
import {
	AsyAbstractHeaderFilterComponent,
	AsyFilterHeaderColumnDef
} from '../asy-abstract-header-filter.component';

@Component({
	selector: 'asy-header-filter[date-filter]',
	templateUrl: './asy-header-date-filter.component.html',
	styleUrls: ['./asy-header-date-filter.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
	imports: [
		FormsModule,
		NgSelectModule,
		TitleCasePipe,
		CdkOverlayOrigin,
		CdkConnectedOverlay,
		A11yModule,
		OverlayModule,
		NgbTooltip,
		NgbInputDatepicker,
		DatepickerRangePopupComponent
	]
})
export class AsyHeaderDateFilterComponent extends AsyAbstractHeaderFilterComponent {
	enabled = signal(false);
	direction = signal('past');
	duration = signal<'hour' | 'day' | 'week' | 'month' | 'year'>('week');
	count = signal(1);
	isCustom = signal(false);
	customRange = signal<Date[]>([]);

	constructor(
		@Inject('MAT_SORT_HEADER_COLUMN_DEF')
		@Optional()
		_columnDef: AsyFilterHeaderColumnDef
	) {
		super(_columnDef);
	}

	handleOutsideClick(event: Event) {
		const isDatePickerOrNgSelect =
			((event.target as Element).closest('bs-daterangepicker-container, ng-dropdown-panel') ??
				null) !== null;

		this.isOpen.set(isDatePickerOrNgSelect);
	}

	onDateFilterChange() {
		if (this.enabled()) {
			super.onFilterChange();
		}
		this.changeDetectorRef.markForCheck();
	}

	_buildState() {
		if (this.enabled()) {
			if (this.isCustom()) {
				return {
					isCustom: true,
					customRange: this.customRange()
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
			this.enabled.set(true);
			if (state.isCustom) {
				this.isCustom.set(true);
				this.customRange.set(state.customRange.map((d: any) => new Date(d)));
			} else {
				this.direction.set(state.direction);
				this.duration.set(state.duration);
				this.count.set(state.count);
			}
			this.onFilterChange();
		}
	}

	_clearState() {
		if (this.enabled()) {
			this.enabled.set(false);
		}
	}

	_buildFilter() {
		let $lte = DateTime.invalid('not set');
		let $gte = DateTime.invalid('not set');

		if (this.enabled()) {
			if (!this.isCustom()) {
				const now = DateTime.utc();

				if (this.direction() === 'past') {
					$gte = now.minus({ [this.duration()]: this.count() });
					$lte = now;
				} else {
					$gte = now;
					$lte = now.plus({ [this.duration()]: this.count() });
				}
			} else if (this.customRange()?.length === 2) {
				[$gte, $lte] = this.customRange().map((date: Date) =>
					DateTime.fromJSDate(date).toUTC(0, { keepLocalTime: true })
				);
			}

			// Normalize to start/end of day
			if (this.isCustom() || this.duration() !== 'hour') {
				$gte = $gte.startOf('day');
				$lte = $lte.endOf('day');
			}
		}

		return { ...($gte.isValid && $lte.isValid && { [this.id]: { $gte, $lte } }) };
	}

	test(input: unknown) {
		console.log(input);
	}
}
