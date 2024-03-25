import { Component, Input, ViewChild, booleanAttribute } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR, NgModel } from '@angular/forms';

import { NgSelectModule } from '@ng-select/ng-select';

/**
 * @deprecated
 * Use multi-select directive instead.  It provides the same functionality, but with more flexibility
 *
 * Replace:
 *
 * <asy-multi-select-input ...></asy-multi-select-input>
 *
 * With:
 *
 * <ng-select multi-select ...></ng-select>
 *
 */
@Component({
	selector: 'asy-multi-select-input',
	templateUrl: './multi-select-input.component.html',
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			// eslint-disable-next-line deprecation/deprecation
			useExisting: MultiSelectInputComponent,
			multi: true
		}
	],
	standalone: true,
	imports: [NgSelectModule, FormsModule]
})
export class MultiSelectInputComponent implements ControlValueAccessor {
	@ViewChild(NgModel) model?: NgModel;

	@Input()
	placeholder = '';

	@Input({ transform: booleanAttribute })
	readonly = false;

	autocompleteOpen = false;

	private innerValue: string[] = [];

	onChange = (_: any) => {
		// do nothing
	};
	onTouched = () => {
		// do nothing
	};

	onSearch($event: { term: string }) {
		this.autocompleteOpen = $event.term.trim().length > 0;
	}

	onAdd() {
		this.autocompleteOpen = false;
	}

	get value(): string[] {
		return this.innerValue;
	}

	set value(value: string[]) {
		if (this.innerValue !== value) {
			this.innerValue = value;
			this.onChange(value);
		}
	}

	writeValue(value: string[]) {
		this.innerValue = value;
	}

	registerOnChange(fn: (_: any) => void): void {
		this.onChange = fn;
	}

	registerOnTouched(fn: () => void): void {
		this.onTouched = fn;
	}
}
