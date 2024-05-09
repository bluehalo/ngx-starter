import { NgIf } from '@angular/common';
import { DestroyRef, Directive, Input, effect, inject, input } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';

import { APP_SESSION } from '../../tokens';
import { Role } from '../role.model';

@Directive({
	selector: '[hasSomeRoles]',
	hostDirectives: [
		{
			directive: NgIf,
			inputs: ['ngIfElse: hasSomeRolesElse', 'ngIfThen: hasSomeRolesThen']
		}
	],
	standalone: true
})
export class HasSomeRolesDirective {
	#ngIfDirective = inject(NgIf);
	#session = inject(APP_SESSION);

	roles = input.required<Array<string | Role>>({ alias: 'hasSomeRoles' });
	andCondition = input(true, { alias: 'hasSomeRolesAnd' });
	orCondition = input(false, { alias: 'hasSomeRolesOr' });

	constructor() {
		effect(() => {
			this.updateNgIf();
		});
	}

	private updateNgIf() {
		this.#ngIfDirective.ngIf =
			this.orCondition() ||
			(this.andCondition() && this.#session().hasSomeRoles(this.roles()));
	}
}
