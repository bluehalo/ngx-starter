import { Component, Input, ViewChild } from '@angular/core';
import { NG_VALUE_ACCESSOR, NgModel, ControlValueAccessor } from '@angular/forms';

@Component({
	selector: 'asy-multi-select-input',
	templateUrl: './multi-select-input.component.html',
	styleUrls: ['./multi-select-input.component.scss'],
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: MultiSelectInputComponent,
			multi: true
		}
	]
})
export class MultiSelectInputComponent implements ControlValueAccessor {

	@Input() placeholder: string;
	@ViewChild(NgModel) model: NgModel;
	autocompleteOpen: boolean = false;

	private innerValue: string[];
	private changed = new Array<(value: string[]) => void>();
	private touched = new Array<() => void>();

	constructor() {}

	onSearch($event) {
		if ( $event.term.trim().length > 0 ) {
			this.autocompleteOpen = true;
		} else {
			this.autocompleteOpen = false;
		}
	}

	onAdd() {
		this.autocompleteOpen = false;
	}

	noResults(term: string, item: string) {
		return false;
	}

	get value(): string[] {
		return this.innerValue;
	}

	set value(value: string[]) {
		if (this.innerValue !== value) {
			this.innerValue = value;
			this.changed.forEach((f) => f(value));
		}
	}

	writeValue(value: string[]) {
		this.innerValue = value;
	}

	registerOnChange(fn: (value: string[]) => void) {
		this.changed.push(fn);
	}

	registerOnTouched(fn: () => void) {
		this.touched.push(fn);
	}

	touch() {
		this.touched.forEach((f) => f());
	}

}
