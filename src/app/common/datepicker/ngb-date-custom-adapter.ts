import { Injectable } from '@angular/core';

import { NgbDateAdapter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import isInteger from 'lodash/isInteger';

/**
 * [`NgbDateAdapter`](#/components/datepicker/api#NgbDateAdapter) implementation that uses
 * native javascript dates as a user date model.
 */

// eslint-disable-next-line @angular-eslint/use-injectable-provided-in
@Injectable()
export class NgbDateCustomAdapter extends NgbDateAdapter<Date> {
	/**
	 * Converts a native `Date` to a `NgbDateStruct`.
	 */
	fromModel(date: number | Date | string | null): NgbDateStruct | null {
		if (date && !(date instanceof Date)) {
			date = new Date(date);
		}
		return date instanceof Date && !isNaN(date.getTime()) ? this._fromNativeDate(date) : null;
	}

	/**
	 * Converts a `NgbDateStruct` to a native `Date`.
	 */
	toModel(date: NgbDateStruct | null): Date | null {
		return date && isInteger(date.year) && isInteger(date.month) && isInteger(date.day)
			? this._toNativeDate(date)
			: null;
	}

	protected _fromNativeDate(date: Date): NgbDateStruct {
		return { year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate() };
	}

	protected _toNativeDate(date: NgbDateStruct): Date {
		const jsDate = new Date(date.year, date.month - 1, date.day, 12);
		// avoid 30 -> 1930 conversion
		jsDate.setFullYear(date.year);
		return jsDate;
	}
}
