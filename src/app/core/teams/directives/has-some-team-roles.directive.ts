import { NgIf } from '@angular/common';
import { DestroyRef, Directive, Input, inject } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';

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
	private team: Pick<Team, '_id'>;
	private roles: Array<string | TeamRole> = [];
	private andCondition = true;
	private orCondition = false;

	private destroyRef = inject(DestroyRef);
	private ngIfDirective = inject(NgIf);
	private teamAuthorizationService = inject(TeamAuthorizationService);
	#session = inject(APP_SESSION);

	@Input({ required: true })
	set hasSomeTeamRoles(team: Pick<Team, '_id'>) {
		this.team = team;
		this.updateNgIf();
	}

	@Input()
	set hasSomeTeamRolesRoles(roles: Array<string | TeamRole>) {
		this.roles = roles;
		this.updateNgIf();
	}

	@Input()
	set hasSomeTeamRolesAnd(condition: boolean) {
		this.andCondition = condition;
		this.updateNgIf();
	}

	@Input()
	set hasSomeTeamRolesOr(condition: boolean) {
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

	protected checkPermission(): boolean {
		return (
			this.#session().isAdmin() ||
			this.teamAuthorizationService.hasSomeRoles(this.team, this.roles)
		);
	}

	private updateNgIf() {
		this.ngIfDirective.ngIf = this.orCondition || (this.andCondition && this.checkPermission());
	}
}
