import { Pipe, PipeTransform } from '@angular/core';

import _isObject from 'lodash/isObject';

@Pipe({
	name: 'sortObjectKeys',
	standalone: true
})
export class SortObjectKeysPipe implements PipeTransform {
	// Derived from http://stackoverflow.com/a/1359808 and http://stackoverflow.com/a/23124958
	transform(obj: unknown): unknown {
		if (!obj || !_isObject(obj)) {
			return obj;
		}

		// Maintain the order of arrays, but sort keys of the array elements
		if (Array.isArray(obj)) {
			return obj.map((o) => this.transform(o)) as Array<Record<string, unknown>>;
		}

		return Object.keys(obj)
			.sort()
			.reduce(
				(newObj, key) => {
					newObj[key] = this.transform((obj as Record<string, unknown>)[key]);
					return newObj;
				},
				{} as Record<string, unknown>
			);
	}
}
