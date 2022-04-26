import { ChangeDetectorRef } from '@angular/core';

import { DateTime, Settings } from 'luxon';

import { AsyFilterHeaderColumnDef } from '../asy-abstract-header-filter.component';
import { AsyFilterDirective } from '../asy-filter.directive';
import { AsyHeaderDateFilterComponent } from './asy-header-date-filter.component';

describe('AsyHeaderDateFilter', () => {
	let dateFilterComponent: AsyHeaderDateFilterComponent;

	let luxonNowFn: () => number;

	beforeAll(() => {
		// preserve default Settings.now function
		luxonNowFn = Settings.now;

		// override Settings.now function to provide consistent value for testing
		const expectedNow = DateTime.utc(2022, 1, 15, 8, 30, 14, 10);
		Settings.now = () => expectedNow.toMillis();
	});

	afterAll(() => {
		// restore default Settings.now function
		Settings.now = luxonNowFn;
	});

	beforeEach(() => {
		dateFilterComponent = new AsyHeaderDateFilterComponent(
			null as unknown as AsyFilterDirective,
			null as unknown as AsyFilterHeaderColumnDef,
			null as unknown as ChangeDetectorRef
		);
	});

	it('expect empty filter when no options set', () => {
		const filter = dateFilterComponent._buildFilter();
		expect(filter).toEqual({});
	});

	it('expect empty filter when disabled', () => {
		dateFilterComponent.enabled = false;
		dateFilterComponent.duration = 'day';
		dateFilterComponent.count = 3;
		const filter = dateFilterComponent._buildFilter();
		expect(filter).toEqual({});
	});

	it('expect proper filter for next 3 hours', () => {
		dateFilterComponent.id = 'dateField';
		dateFilterComponent.enabled = true;
		dateFilterComponent.duration = 'hour';
		dateFilterComponent.count = 3;
		dateFilterComponent.direction = 'next';
		const filter = dateFilterComponent._buildFilter();
		expect(filter).toEqual({
			dateField: {
				$gte: DateTime.utc(2022, 1, 15, 8, 30, 14, 10),
				$lte: DateTime.utc(2022, 1, 15, 11, 30, 14, 10)
			}
		});
	});

	it('expect proper filter for past 6 hours', () => {
		dateFilterComponent.id = 'dateField';
		dateFilterComponent.enabled = true;
		dateFilterComponent.duration = 'hour';
		dateFilterComponent.count = 6;
		dateFilterComponent.direction = 'past';
		const filter = dateFilterComponent._buildFilter();
		expect(filter).toEqual({
			dateField: {
				$gte: DateTime.utc(2022, 1, 15, 2, 30, 14, 10),
				$lte: DateTime.utc(2022, 1, 15, 8, 30, 14, 10)
			}
		});
	});

	it('expect proper filter for next 3 days', () => {
		dateFilterComponent.id = 'dateField';
		dateFilterComponent.enabled = true;
		dateFilterComponent.duration = 'day';
		dateFilterComponent.count = 3;
		dateFilterComponent.direction = 'next';
		const filter = dateFilterComponent._buildFilter();
		expect(filter).toEqual({
			dateField: {
				$gte: DateTime.utc(2022, 1, 15),
				$lte: DateTime.utc(2022, 1, 18).endOf('day')
			}
		});
	});

	it('expect proper filter for past 6 days', () => {
		dateFilterComponent.id = 'dateField';
		dateFilterComponent.enabled = true;
		dateFilterComponent.duration = 'day';
		dateFilterComponent.count = 6;
		dateFilterComponent.direction = 'past';
		const filter = dateFilterComponent._buildFilter();
		expect(filter).toEqual({
			dateField: {
				$gte: DateTime.utc(2022, 1, 9),
				$lte: DateTime.utc(2022, 1, 15).endOf('day')
			}
		});
	});

	it('expect proper filter for next 3 weeks', () => {
		dateFilterComponent.id = 'dateField';
		dateFilterComponent.enabled = true;
		dateFilterComponent.duration = 'week';
		dateFilterComponent.count = 3;
		dateFilterComponent.direction = 'next';
		const filter = dateFilterComponent._buildFilter();
		expect(filter).toEqual({
			dateField: {
				$gte: DateTime.utc(2022, 1, 15),
				$lte: DateTime.utc(2022, 2, 5).endOf('day')
			}
		});
	});

	it('expect proper filter for past 2 weeks', () => {
		dateFilterComponent.id = 'dateField';
		dateFilterComponent.enabled = true;
		dateFilterComponent.duration = 'week';
		dateFilterComponent.count = 2;
		dateFilterComponent.direction = 'past';
		const filter = dateFilterComponent._buildFilter();
		expect(filter).toEqual({
			dateField: {
				$gte: DateTime.utc(2022, 1, 1),
				$lte: DateTime.utc(2022, 1, 15).endOf('day')
			}
		});
	});

	it('expect proper filter for custom range', () => {
		dateFilterComponent.id = 'dateField';
		dateFilterComponent.enabled = true;
		dateFilterComponent.isCustom = true;
		dateFilterComponent.customRange = [
			DateTime.local(2022, 1, 1).toJSDate(),
			DateTime.local(2022, 8, 5).toJSDate()
		];
		const filter = dateFilterComponent._buildFilter();
		expect(filter).toEqual({
			dateField: {
				$gte: DateTime.utc(2022, 1, 1),
				$lte: DateTime.utc(2022, 8, 5).endOf('day')
			}
		});
	});
});
