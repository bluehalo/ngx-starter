import { Pipe, PipeTransform } from '@angular/core';

import { UtcDateUtils } from './utc-date-utils.service';

@Pipe({
	name: 'utcDate',
	standalone: true
})
export class UtcDatePipe implements PipeTransform {
	transform(value: Date | string | number | null | undefined, format?: string): string {
		return UtcDateUtils.format(value, format);
	}
}
