import { KeysPipe } from './keys.pipe';

describe('KeysPipe', () => {

	let keys = new KeysPipe();

	it('transforms object with 2 keys to array of length 2', () => {
		let transformed = keys.transform({foo: 'bar', one: 'two'});
		transformed.sort(sortTransformedArray);
		expect(transformed).toEqual([{key: 'foo', value: 'bar'}, {key: 'one', value: 'two'}]);
	});

	it('transforms empty object to empty array', () => {
		expect(keys.transform({})).toEqual([]);
	});

	function sortTransformedArray(obj1: any, obj2: any) {
		let keysCompared = obj1.key.localeCompare(obj2.key);
		if (keysCompared !== 0) {
			return keysCompared;
		}
		return obj1.value.localeCompare(obj2.value);
	}

});
