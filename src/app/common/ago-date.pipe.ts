import {Pipe, PipeTransform} from '@angular/core';
import * as moment from 'moment';

@Pipe({name: 'agoDate'})
export class AgoDatePipe implements PipeTransform {
	transform(date: Date | number, hideAgo?: boolean): string {
		if (null != date) {

			// If it's not null, and it's either a number or a date
			return moment(date).fromNow(hideAgo);
		}

		return 'unknown';
	}
}
