import { NgIf } from '@angular/common';
import { DestroyRef, Directive, Input, inject } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';

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
	role: string | Role;
	andCondition = true;
	orCondition = false;

	private destroyRef = inject(DestroyRef);
	private ngIfDirective = inject(NgIf);
	#session = inject(APP_SESSION);

	@Input({ required: true })
	set hasRole(role: string | Role) {
		this.role = role;
		this.updateNgIf();
	}

	@Input()
	set hasRoleAnd(condition: boolean) {
		this.andCondition = condition;
		this.updateNgIf();
	}

	@Input()
	set hasRoleOr(condition: boolean) {
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
			this.orCondition || (this.andCondition && this.#session().hasRole(this.role));
	}
}
