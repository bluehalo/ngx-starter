import { SortObjectKeysPipe } from './sort-object-keys.pipe';

describe('SortObjectKeysPipe', () => {
	const pipe = new SortObjectKeysPipe();

	it('should not transform sorted object with 2 keys to array of length 2', () => {
		const transformed = pipe.transform({
			foo: 'bar',
			one: 'two'
		});
		expect(JSON.stringify(transformed)).toEqual(
			JSON.stringify({
				foo: 'bar',
				one: 'two'
			})
		);
	});

	it('should transform unsorted object with 2 keys to array of length 2', () => {
		const transformed = pipe.transform({
			one: 'two',
			foo: {
				efgh: true,
				ijhk: [
					{ b: false, a: false },
					{ a: true, b: true }
				],
				abcd: 1
			}
		});
		expect(JSON.stringify(transformed)).toEqual(
			JSON.stringify({
				foo: {
					abcd: 1,
					efgh: true,
					ijhk: [
						{ a: false, b: false },
						{ a: true, b: true }
					]
				},
				one: 'two'
			})
		);

		// Make sure stringify is not performing the sorting
		expect(JSON.stringify(transformed)).not.toEqual(
			JSON.stringify({
				one: 'two',
				foo: {
					abcd: 1,
					efgh: true,
					ijhk: [
						{ a: false, b: false },
						{ a: true, b: true }
					]
				}
			})
		);
	});

	it('should transform empty object to empty object', () => {
		expect(pipe.transform({})).toEqual({});
	});

	it('should transform null object to null object', () => {
		expect(pipe.transform(null)).toEqual(null);
	});
});
