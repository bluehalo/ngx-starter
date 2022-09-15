import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { DateTime, Settings } from 'luxon';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

import { AsyFilterDirective } from '../asy-filter.directive';
import { AsyHeaderDateFilterComponent } from './asy-header-date-filter.component';

describe('AsyHeaderDateFilter', () => {
	let component: AsyHeaderDateFilterComponent;
	let fixture: ComponentFixture<AsyHeaderDateFilterComponent>;
	let filterSpy: any;

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

	beforeEach(async () => {
		filterSpy = jasmine.createSpyObj('AsyFilterDirective', ['register', 'deregister'], {
			dataSource: { storageKey: 'test' }
		});
		filterSpy.register.and.callFake(() => {});
		filterSpy.deregister.and.callFake(() => {});

		await TestBed.configureTestingModule({
			declarations: [AsyHeaderDateFilterComponent],
			imports: [BrowserAnimationsModule, BsDropdownModule],
			providers: [{ provide: AsyFilterDirective, useValue: filterSpy as AsyFilterDirective }]
		}).compileComponents();

		fixture = TestBed.createComponent(AsyHeaderDateFilterComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('expect empty filter when no options set', () => {
		const filter = component._buildFilter();
		expect(filter).toEqual({});
	});

	it('expect empty filter when disabled', () => {
		component.enabled = false;
		component.duration = 'day';
		component.count = 3;
		const filter = component._buildFilter();
		expect(filter).toEqual({});
	});

	it('expect proper filter for next 3 hours', () => {
		component.id = 'dateField';
		component.enabled = true;
		component.duration = 'hour';
		component.count = 3;
		component.direction = 'next';
		const filter = component._buildFilter();
		expect(filter).toEqual({
			dateField: {
				$gte: DateTime.utc(2022, 1, 15, 8, 30, 14, 10),
				$lte: DateTime.utc(2022, 1, 15, 11, 30, 14, 10)
			}
		});
	});

	it('expect proper filter for past 6 hours', () => {
		component.id = 'dateField';
		component.enabled = true;
		component.duration = 'hour';
		component.count = 6;
		component.direction = 'past';
		const filter = component._buildFilter();
		expect(filter).toEqual({
			dateField: {
				$gte: DateTime.utc(2022, 1, 15, 2, 30, 14, 10),
				$lte: DateTime.utc(2022, 1, 15, 8, 30, 14, 10)
			}
		});
	});

	it('expect proper filter for next 3 days', () => {
		component.id = 'dateField';
		component.enabled = true;
		component.duration = 'day';
		component.count = 3;
		component.direction = 'next';
		const filter = component._buildFilter();
		expect(filter).toEqual({
			dateField: {
				$gte: DateTime.utc(2022, 1, 15),
				$lte: DateTime.utc(2022, 1, 18).endOf('day')
			}
		});
	});

	it('expect proper filter for past 6 days', () => {
		component.id = 'dateField';
		component.enabled = true;
		component.duration = 'day';
		component.count = 6;
		component.direction = 'past';
		const filter = component._buildFilter();
		expect(filter).toEqual({
			dateField: {
				$gte: DateTime.utc(2022, 1, 9),
				$lte: DateTime.utc(2022, 1, 15).endOf('day')
			}
		});
	});

	it('expect proper filter for next 3 weeks', () => {
		component.id = 'dateField';
		component.enabled = true;
		component.duration = 'week';
		component.count = 3;
		component.direction = 'next';
		const filter = component._buildFilter();
		expect(filter).toEqual({
			dateField: {
				$gte: DateTime.utc(2022, 1, 15),
				$lte: DateTime.utc(2022, 2, 5).endOf('day')
			}
		});
	});

	it('expect proper filter for past 2 weeks', () => {
		component.id = 'dateField';
		component.enabled = true;
		component.duration = 'week';
		component.count = 2;
		component.direction = 'past';
		const filter = component._buildFilter();
		expect(filter).toEqual({
			dateField: {
				$gte: DateTime.utc(2022, 1, 1),
				$lte: DateTime.utc(2022, 1, 15).endOf('day')
			}
		});
	});

	it('expect proper filter for custom range', () => {
		component.id = 'dateField';
		component.enabled = true;
		component.isCustom = true;
		component.customRange = [
			DateTime.local(2022, 1, 1).toJSDate(),
			DateTime.local(2022, 8, 5).toJSDate()
		];
		const filter = component._buildFilter();
		expect(filter).toEqual({
			dateField: {
				$gte: DateTime.utc(2022, 1, 1),
				$lte: DateTime.utc(2022, 8, 5).endOf('day')
			}
		});
	});
});
