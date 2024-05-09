import { NgIf } from '@angular/common';
import { Directive, effect, inject, input } from '@angular/core';

import { APP_SESSION } from '../../tokens';
import { TeamAuthorizationService } from '../team-authorization.service';
import { TeamRole } from '../team-role.model';
import { Team } from '../team.model';

@Directive({
	selector: '[hasSomeTeamRoles]',
	hostDirectives: [
		{
			directive: NgIf,
			inputs: ['ngIfElse: hasSomeTeamRolesElse', 'ngIfThen: hasSomeTeamRolesThen']
		}
	],
	standalone: true
})
export class HasSomeTeamRolesDirective {
	readonly #ngIfDirective = inject(NgIf);
	readonly #teamAuthorizationService = inject(TeamAuthorizationService);
	readonly #session = inject(APP_SESSION);

	readonly team = input.required<Pick<Team, '_id'>>({ alias: 'hasSomeTeamRoles' });
	readonly roles = input.required<Array<string | TeamRole>>({ alias: 'hasSomeTeamRolesRole' });
	readonly andCondition = input(true, { alias: 'hasSomeTeamRolesAnd' });
	readonly orCondition = input(false, { alias: 'hasSomeTeamRolesOr' });

	constructor() {
		effect(() => {
			this.updateNgIf();
		});
	}

	protected checkPermission(): boolean {
		return (
			this.#session().isAdmin() ||
			this.#teamAuthorizationService.hasSomeRoles(this.team(), this.roles())
		);
	}

	private updateNgIf() {
		this.#ngIfDirective.ngIf =
			this.orCondition() || (this.andCondition() && this.checkPermission());
	}
}
