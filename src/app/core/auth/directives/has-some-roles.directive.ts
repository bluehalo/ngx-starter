import { NgIf } from '@angular/common';
import { Directive, Injector, OnInit, effect, inject, input } from '@angular/core';

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
export class HasSomeRolesDirective implements OnInit {
	readonly #ngIfDirective = inject(NgIf);
	readonly #injector = inject(Injector);
	readonly #session = inject(APP_SESSION);

	readonly roles = input.required<Array<string | Role>>({ alias: 'hasSomeRoles' });
	readonly andCondition = input(true, { alias: 'hasSomeRolesAnd' });
	readonly orCondition = input(false, { alias: 'hasSomeRolesOr' });

	ngOnInit() {
		effect(
			() => {
				this.updateNgIf();
			},
			{ injector: this.#injector }
		);
	}

	private updateNgIf() {
		this.#ngIfDirective.ngIf =
			this.orCondition() ||
			(this.andCondition() && this.#session().hasSomeRoles(this.roles()));
	}
}
