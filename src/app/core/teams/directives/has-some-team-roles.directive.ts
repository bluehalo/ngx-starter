import { NgIf } from '@angular/common';
import { Directive, Input, OnInit, inject } from '@angular/core';

import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { AuthorizationService } from '../../auth/authorization.service';
import { SessionService } from '../../auth/session.service';
import { TeamAuthorizationService } from '../team-authorization.service';
import { TeamRole } from '../team-role.model';
import { Team } from '../team.model';

@UntilDestroy()
@Directive({
	selector: '[hasSomeTeamRoles]',
	hostDirectives: [
		{
			directive: NgIf,
			inputs: ['ngIfElse: hasSomeTeamRolesElse', 'ngIfThen: hasSomeTeamRolesThen']
		}
	]
})
export class HasSomeTeamRolesDirective implements OnInit {
	private team: Pick<Team, '_id'>;
	private roles: Array<string | TeamRole> = [];
	private andCondition = true;
	private orCondition = false;

	private ngIfDirective = inject(NgIf);
	private sessionService = inject(SessionService);
	private authorizationService = inject(AuthorizationService);
	private teamAuthorizationService = inject(TeamAuthorizationService);

	@Input()
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

	ngOnInit() {
		this.sessionService
			.getSession()
			.pipe(untilDestroyed(this))
			.subscribe(() => {
				this.updateNgIf();
			});
	}

	protected checkPermission(): boolean {
		return (
			this.authorizationService.isAdmin() ||
			this.teamAuthorizationService.hasSomeRoles(this.team, this.roles)
		);
	}

	private updateNgIf() {
		this.ngIfDirective.ngIf = this.orCondition || (this.andCondition && this.checkPermission());
	}
}
