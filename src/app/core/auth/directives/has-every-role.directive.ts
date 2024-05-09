import { NgIf } from '@angular/common';
import { Directive, effect, inject, input } from '@angular/core';

import { APP_SESSION } from '../../tokens';
import { Role } from '../role.model';

@Directive({
	selector: '[hasEveryRole]',
	hostDirectives: [
		{
			directive: NgIf,
			inputs: ['ngIfElse: hasEveryRoleElse', 'ngIfThen: hasEveryRoleThen']
		}
	],
	standalone: true
})
export class HasEveryRoleDirective {
	#ngIfDirective = inject(NgIf);
	#session = inject(APP_SESSION);

	roles = input.required<Array<string | Role>>({ alias: 'hasEveryRole' });
	andCondition = input(true, { alias: 'hasEveryRoleAnd' });
	orCondition = input(false, { alias: 'hasEveryRoleOr' });

	constructor() {
		effect(() => {
			this.updateNgIf();
		});
	}

	private updateNgIf() {
		this.#ngIfDirective.ngIf =
			this.orCondition() ||
			(this.andCondition() && this.#session().hasEveryRole(this.roles()));
	}
}
