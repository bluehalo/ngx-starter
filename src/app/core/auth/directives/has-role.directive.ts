import { NgIf } from '@angular/common';
import { Directive, effect, inject, input } from '@angular/core';

import { APP_SESSION } from '../../tokens';
import { Role } from '../role.model';

@Directive({
	selector: '[hasRole]',
	hostDirectives: [
		{
			directive: NgIf,
			inputs: ['ngIfElse: hasRoleElse', 'ngIfThen: hasRoleThen']
		}
	],
	standalone: true
})
export class HasRoleDirective {
	#ngIfDirective = inject(NgIf);
	#session = inject(APP_SESSION);

	role = input.required<string | Role>({ alias: 'hasRole' });
	andCondition = input(true, { alias: 'hasRoleAnd' });
	orCondition = input(false, { alias: 'hasRoleOr' });

	constructor() {
		effect(() => {
			this.updateNgIf();
		});
	}

	private updateNgIf() {
		this.#ngIfDirective.ngIf =
			this.orCondition() || (this.andCondition() && this.#session().hasRole(this.role()));
	}
}
