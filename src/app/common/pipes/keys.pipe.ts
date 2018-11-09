import { Pipe, PipeTransform } from '@angular/core';

import { forOwn } from 'lodash';

@Pipe({name: 'keys'})
export class KeysPipe implements PipeTransform {
	transform(obj: any): any {
		let values: any[] = [];
		forOwn(obj, (val: any, key: any) => {
			values.push({ key: key, value: val });
		});
		return values;
	}
}
