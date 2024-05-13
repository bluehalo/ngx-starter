import { NgIf } from '@angular/common';
import { Directive, Injector, OnInit, effect, inject, input } from '@angular/core';

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
export class HasRoleDirective implements OnInit {
	readonly #ngIfDirective = inject(NgIf);
	readonly #injector = inject(Injector);
	readonly #session = inject(APP_SESSION);

	readonly role = input.required<string | Role>({ alias: 'hasRole' });
	readonly andCondition = input(true, { alias: 'hasRoleAnd' });
	readonly orCondition = input(false, { alias: 'hasRoleOr' });

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
			this.orCondition() || (this.andCondition() && this.#session().hasRole(this.role()));
	}
}
