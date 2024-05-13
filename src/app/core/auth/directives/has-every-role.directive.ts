import { NgIf } from '@angular/common';
import { Directive, Injector, OnInit, effect, inject, input } from '@angular/core';

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
export class HasEveryRoleDirective implements OnInit {
	readonly #ngIfDirective = inject(NgIf);
	readonly #injector = inject(Injector);
	readonly #session = inject(APP_SESSION);

	readonly roles = input.required<Array<string | Role>>({ alias: 'hasEveryRole' });
	readonly andCondition = input(true, { alias: 'hasEveryRoleAnd' });
	readonly orCondition = input(false, { alias: 'hasEveryRoleOr' });

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
			(this.andCondition() && this.#session().hasEveryRole(this.roles()));
	}
}
