import { Pipe, PipeTransform } from '@angular/core';

import { DateTime } from 'luxon';

@Pipe({
	name: 'agoDate',
	standalone: true
})
export class AgoDatePipe implements PipeTransform {
	transform(date: Date | string | number | null | undefined, hideAgo?: boolean): string {
		if (null != date) {
			let agoDate;
			// If it's not null, and it's either a number, string or a date
			if (typeof date === 'number') {
				agoDate = DateTime.fromMillis(date).toRelative();
			} else if (typeof date === 'string') {
				agoDate = DateTime.fromISO(date).toRelative();
			} else if (date instanceof Date) {
				agoDate = DateTime.fromJSDate(date).toRelative();
			}

			if (agoDate) {
				if (hideAgo) {
					return agoDate.replace(' ago', '');
				}
				return agoDate;
			}
		}

		return 'unknown';
	}
}
