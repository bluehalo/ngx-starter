import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import { NgIf } from '@angular/common';
import { DestroyRef, Directive, Input, inject } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';

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
	private _isAuthenticated = true;
	andCondition = true;
	orCondition = false;

	private destroyRef = inject(DestroyRef);
	private ngIfDirective = inject(NgIf);
	#session = inject(APP_SESSION);

	@Input()
	set isAuthenticated(isAuthenticated: BooleanInput) {
		this._isAuthenticated = coerceBooleanProperty(isAuthenticated);
		this.updateNgIf();
	}

	@Input()
	set isAuthenticatedAnd(condition: boolean) {
		this.andCondition = condition;
		this.updateNgIf();
	}

	@Input()
	set isAuthenticatedOr(condition: boolean) {
		this.orCondition = condition;
		this.updateNgIf();
	}

	constructor() {
		toObservable(this.#session)
			.pipe(takeUntilDestroyed(this.destroyRef))
			.subscribe(() => {
				this.updateNgIf();
			});
	}

	private updateNgIf() {
		this.ngIfDirective.ngIf =
			this.orCondition || (this.andCondition && this.#session().isAuthenticated());
	}
}
