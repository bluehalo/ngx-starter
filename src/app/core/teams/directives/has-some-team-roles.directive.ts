import { NgIf } from '@angular/common';
import { Directive, Injector, OnInit, effect, inject, input } from '@angular/core';

import { APP_SESSION } from '../../tokens';
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
export class HasSomeTeamRolesDirective implements OnInit {
	readonly #ngIfDirective = inject(NgIf);
	readonly #injector = inject(Injector);
	readonly #session = inject(APP_SESSION);

	readonly team = input.required<Pick<Team, '_id'>>({ alias: 'hasSomeTeamRoles' });
	readonly roles = input.required<Array<string | TeamRole>>({ alias: 'hasSomeTeamRolesRoles' });
	readonly andCondition = input(true, { alias: 'hasSomeTeamRolesAnd' });
	readonly orCondition = input(false, { alias: 'hasSomeTeamRolesOr' });

	ngOnInit() {
		effect(
			() => {
				this.updateNgIf();
			},
			{ injector: this.#injector }
		);
	}

	protected checkPermission(): boolean {
		return (
			this.#session().isAdmin() || this.#session().hasSomeTeamRoles(this.team(), this.roles())
		);
	}

	private updateNgIf() {
		this.#ngIfDirective.ngIf =
			this.orCondition() || (this.andCondition() && this.checkPermission());
	}
}
