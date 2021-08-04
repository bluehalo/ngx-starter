import { Pipe, PipeTransform } from '@angular/core';

import { DateTime } from 'luxon';

@Pipe({ name: 'agoDate' })
export class AgoDatePipe implements PipeTransform {
	transform(date: Date | string | number, hideAgo?: boolean): string {
		if (null != date) {
			let agoDate;
			// If it's not null, and it's either a number or a date
			if (typeof date === 'number') {
				agoDate = DateTime.fromMillis(date).toRelative();
			} else if (date instanceof Date) {
				agoDate = DateTime.fromJSDate(date).toRelative();
			}

			if (hideAgo && agoDate.indexOf('ago')) {
				return agoDate.replace(' ago', '');
			} else {
				return agoDate;
			}
		}

		return 'unknown';
	}
}
