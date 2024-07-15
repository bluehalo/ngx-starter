import { JsonPipe } from '@angular/common';
import {
	Component,
	computed,
	effect,
	forwardRef,
	inject,
	input,
	signal,
	viewChild
} from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';

import {
	NgbCalendar,
	NgbDate,
	NgbDateAdapter,
	NgbDateParserFormatter,
	NgbDatepickerModule,
	NgbInputDatepicker
} from '@ng-bootstrap/ng-bootstrap';

type DateRange = [Date | null, Date | null];

@Component({
	selector: 'app-datepicker-range-popup',
	standalone: true,
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => DatepickerRangePopupComponent),
			multi: true
		}
	],
	imports: [NgbDatepickerModule, FormsModule, JsonPipe],
	templateUrl: './datepicker-range-popup.component.html',
	styleUrl: './datepicker-range-popup.component.scss'
})
export class DatepickerRangePopupComponent implements ControlValueAccessor {
	readonly #calendar = inject(NgbCalendar);
	readonly formatter = inject(NgbDateParserFormatter);
	readonly #adapter = inject(NgbDateAdapter);

	readonly #changed = new Array<(value: DateRange) => void>();
	readonly #touched = new Array<() => void>();

	readonly datepicker = viewChild.required(NgbInputDatepicker);

	readonly disabled = input(false);

	readonly fromDate = signal<NgbDate | null>(null);
	readonly toDate = signal<NgbDate | null>(null);
	readonly hoveredDate = signal<NgbDate | null>(null);

	readonly fromDateString = computed(() => this.formatter.format(this.fromDate()));
	readonly toDateString = computed(() => this.formatter.format(this.toDate()));

	readonly asNativeDateTuple = computed<DateRange>(() => [
		this.#adapter.toModel(this.fromDate()),
		this.#adapter.toModel(this.toDate())
	]);

	constructor() {
		effect(() => {
			this.propagateChange();
		});
	}

	writeValue(value: DateRange) {
		this.fromDate.set(NgbDate.from(this.#adapter.fromModel(value?.[0])));
		this.toDate.set(NgbDate.from(this.#adapter.fromModel(value?.[1])));
	}

	registerOnChange(fn: (value: DateRange) => void) {
		this.#changed.push(fn);
	}

	registerOnTouched(fn: () => void) {
		this.#touched.push(fn);
	}

	propagateChange() {
		this.#changed.forEach((f) => f(this.asNativeDateTuple()));
	}

	onDateSelection(date: NgbDate) {
		if (!this.fromDate() && !this.toDate()) {
			this.fromDate.set(date);
		} else if (this.fromDate() && !this.toDate() && date && date.after(this.fromDate())) {
			this.toDate.set(date);
			this.datepicker().close();
		} else {
			this.toDate.set(null);
			this.fromDate.set(date);
		}
	}

	isHovered(date: NgbDate) {
		return (
			this.fromDate() &&
			!this.toDate() &&
			this.hoveredDate() &&
			date.after(this.fromDate()) &&
			date.before(this.hoveredDate())
		);
	}

	isInside(date: NgbDate) {
		return this.toDate() && date.after(this.fromDate()) && date.before(this.toDate());
	}

	isRange(date: NgbDate) {
		return (
			date.equals(this.fromDate()) ||
			(this.toDate() && date.equals(this.toDate())) ||
			this.isInside(date) ||
			this.isHovered(date)
		);
	}

	validateInput(currentValue: NgbDate | null, input: string): NgbDate | null {
		const parsed = this.formatter.parse(input);
		return parsed && this.#calendar.isValid(NgbDate.from(parsed))
			? NgbDate.from(parsed)
			: currentValue;
	}
}
