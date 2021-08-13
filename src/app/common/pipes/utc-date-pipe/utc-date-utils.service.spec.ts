import { UtcDateUtils } from './utc-date-utils.service';

describe('UtcDateUtils', () => {
	describe('format', () => {
		// Added Z to end of input time string to clarify that time should be in UTC
		it('transforms date string to requested format', () => {
			expect(UtcDateUtils.format('2016-01-31T00:00:00.000Z', 'DDDD, h:mm:ss a')).toBe(
				'Sunday, January 31, 2016, 12:00:00 AM'
			);
		});

		it('transforms date string to default format if no format is specified', () => {
			expect(UtcDateUtils.format('2016-01-31T00:00:00.000Z')).toBe('2016-01-31 00:00:00');
		});

		it('transforms milliseconds date to default format if no format is specified', () => {
			expect(UtcDateUtils.format(1492440722873)).toBe('2017-04-17 14:52:02');
		});

		it('transforms milliseconds string to default format if no format is specified', () => {
			expect(UtcDateUtils.format('1492440722873')).toBe('2017-04-17 14:52:02');
		});

		it('transforms milliseconds date to requested format', () => {
			expect(UtcDateUtils.format(1492440722873, 'DDDD, h:mm:ss a')).toBe(
				'Monday, April 17, 2017, 2:52:02 PM'
			);
		});

		it('transforms moment date to requested format', () => {
			expect(UtcDateUtils.format(1492440722873, 'DDDD')).toBe('Monday, April 17, 2017');
		});

		it('returns dash if input is invalid', () => {
			expect(UtcDateUtils.format('gibberish')).toBe('-');
		});

		it('returns dash if input is null', () => {
			expect(UtcDateUtils.format(null)).toBe('-');
		});

		it('returns dash if input is undefined', () => {
			expect(UtcDateUtils.format(undefined)).toBe('-');
		});
	});
});
