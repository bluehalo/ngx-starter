import { NgIf } from '@angular/common';
import { DestroyRef, Directive, Input, inject } from '@angular/core';
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
	roles: Array<string | Role>;
	andCondition = true;
	orCondition = false;

	private destroyRef = inject(DestroyRef);
	private ngIfDirective = inject(NgIf);
	#session = inject(APP_SESSION);

	@Input({ required: true })
	set hasSomeRoles(roles: Array<string | Role>) {
		this.roles = roles;
		this.updateNgIf();
	}

	@Input()
	set hasSomeRolesAnd(condition: boolean) {
		this.andCondition = condition;
		this.updateNgIf();
	}

	@Input()
	set hasSomeRolesOr(condition: boolean) {
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
			this.orCondition || (this.andCondition && this.#session().hasSomeRoles(this.roles));
	}
}
