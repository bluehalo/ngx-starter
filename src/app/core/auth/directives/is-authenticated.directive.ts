import { NgIf } from '@angular/common';
import { Directive, booleanAttribute, effect, inject, input } from '@angular/core';

import { APP_SESSION } from '../../tokens';

@Directive({
	selector: '[isAuthenticated]',
	hostDirectives: [
		{
			directive: NgIf,
			inputs: ['ngIfElse: isAuthenticatedElse', 'ngIfThen: isAuthenticatedThen']
		}
	],
	standalone: true
})
export class IsAuthenticatedDirective {
	#ngIfDirective = inject(NgIf);
	#session = inject(APP_SESSION);

	isAuthenticated = input(true, { transform: booleanAttribute });
	andCondition = input(true, { alias: 'isAuthenticatedAnd' });
	orCondition = input(false, { alias: 'isAuthenticatedOr' });

	constructor() {
		effect(() => {
			this.updateNgIf();
		});
	}
	private updateNgIf() {
		this.#ngIfDirective.ngIf =
			this.orCondition() || (this.andCondition() && this.#session().isAuthenticated());
	}
}
