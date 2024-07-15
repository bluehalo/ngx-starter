import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatepickerRangePopupComponent } from './datepicker-range-popup.component';

describe('DatepickerRangePopupComponent', () => {
	let component: DatepickerRangePopupComponent;
	let fixture: ComponentFixture<DatepickerRangePopupComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [DatepickerRangePopupComponent]
		}).compileComponents();

		fixture = TestBed.createComponent(DatepickerRangePopupComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
