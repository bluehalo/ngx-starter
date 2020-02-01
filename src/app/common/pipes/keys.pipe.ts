import { Pipe, PipeTransform } from '@angular/core';

import forOwn from 'lodash/forOwn';

@Pipe({ name: 'keys' })
export class KeysPipe implements PipeTransform {
	transform(obj: any): any {
		const values: any[] = [];
		forOwn(obj, (val: any, key: any) => {
			values.push({ key, value: val });
		});
		return values;
	}
}
