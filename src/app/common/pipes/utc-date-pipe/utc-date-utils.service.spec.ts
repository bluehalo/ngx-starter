import { utc } from 'moment';

import { UtcDateUtils } from './utc-date-utils.service';

describe('UtcDateUtils', () => {
	describe('format', () => {
		it('transforms date string to requested format', () => {
			expect(
				UtcDateUtils.format('2016-01-31T00:00:00.000', 'dddd, MMMM Do YYYY, h:mm:ss a')
			).toBe('Sunday, January 31st 2016, 12:00:00 am');
		});

		it('transforms date string to default format if no format is specified', () => {
			expect(UtcDateUtils.format('2016-01-31T00:00:00.000')).toBe('2016-01-31 00:00:00Z');
		});

		it('transforms milliseconds date to default format if no format is specified', () => {
			expect(UtcDateUtils.format(1492440722873)).toBe('2017-04-17 14:52:02Z');
		});

		it('transforms milliseconds string to default format if no format is specified', () => {
			expect(UtcDateUtils.format('1492440722873')).toBe('2017-04-17 14:52:02Z');
		});

		it('transforms milliseconds date to requested format', () => {
			expect(UtcDateUtils.format(1492440722873, 'dddd, MMMM Do YYYY, h:mm:ss a')).toBe(
				'Monday, April 17th 2017, 2:52:02 pm'
			);
		});

		it('transforms moment date to requested format', () => {
			expect(UtcDateUtils.format(utc(1492440722873), 'dddd, MMMM Do YYYY')).toBe(
				'Monday, April 17th 2017'
			);
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
