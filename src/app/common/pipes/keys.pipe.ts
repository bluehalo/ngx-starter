import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'keys',
	standalone: true
})
export class KeysPipe implements PipeTransform {
	transform<V>(obj: object): Array<{ key: string; value: V }> {
		return Object.entries(obj).map(([key, value]) => ({ key, value }));
	}
}
