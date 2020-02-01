import { Pipe, PipeTransform } from '@angular/core';

import _isArray from 'lodash/isArray';
import _isObject from 'lodash/isObject';
import _keys from 'lodash/keys';

@Pipe({ name: 'sortObjectKeys' })
export class SortObjectKeysPipe implements PipeTransform {
	// Derived from http://stackoverflow.com/a/1359808 and http://stackoverflow.com/a/23124958
	transform(obj: any): any {
		if (null == obj || !_isObject(obj)) {
			return obj;
		}

		// Maintain the order of arrays, but sort keys of the array elements
		if (_isArray(obj)) {
			return obj.map((o: any) => this.transform(o));
		}

		const sorted: any = {};
		const keys: string[] = _keys(obj).sort();

		for (const key of keys) {
			sorted[key] = this.transform(obj[key]);
		}

		return sorted;
	}
}
