import { Attribute, Directive, forwardRef } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';

@Directive({
	selector:
		'[notWhitespace][formControlName],[notWhitespace][formControl],[notWhitespace][ngModel]',
	providers: [
		{
			provide: NG_VALIDATORS,
			useExisting: forwardRef(() => NotWhitespaceValidator),
			multi: true
		}
	]
})
export class NotWhitespaceValidator implements Validator {
	constructor(@Attribute('notWhitespace') public notWhitespace: string) {}

	validate(c: AbstractControl): ValidationErrors | null {
		const value = c.value;

		if (value && value.trim().length === 0)
			return {
				notWhitespace: false
			};
		return null;
	}
}
