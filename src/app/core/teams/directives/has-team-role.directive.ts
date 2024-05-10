import { NgIf } from '@angular/common';
import { Directive, effect, inject, input } from '@angular/core';

import { APP_SESSION } from '../../tokens';
import { TeamRole } from '../team-role.model';
import { Team } from '../team.model';

@Directive({
	selector: '[hasTeamRole]',
	hostDirectives: [
		{
			directive: NgIf,
			inputs: ['ngIfElse: hasTeamRoleElse', 'ngIfThen: hasTeamRoleThen']
		}
	],
	standalone: true
})
export class HasTeamRoleDirective {
	readonly #ngIfDirective = inject(NgIf);
	readonly #session = inject(APP_SESSION);

	readonly team = input.required<Pick<Team, '_id'>>({ alias: 'hasTeamRole' });
	readonly role = input.required<string | TeamRole>({ alias: 'hasTeamRoleRole' });
	readonly andCondition = input(true, { alias: 'hasTeamRoleAnd' });
	readonly orCondition = input(false, { alias: 'hasTeamRoleOr' });

	constructor() {
		effect(() => {
			this.updateNgIf();
		});
	}

	protected checkPermission(): boolean {
		return this.#session().isAdmin() || this.#session().hasTeamRole(this.team(), this.role());
	}

	private updateNgIf() {
		this.#ngIfDirective.ngIf =
			this.orCondition() || (this.andCondition() && this.checkPermission());
	}
}
