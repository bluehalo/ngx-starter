import { NgIf } from '@angular/common';
import { DestroyRef, Directive, Input, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { AuthorizationService } from '../../auth/authorization.service';
import { SessionService } from '../../auth/session.service';
import { TeamAuthorizationService } from '../team-authorization.service';
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
export class HasTeamRoleDirective implements OnInit {
	private team: Pick<Team, '_id'>;
	private role: string | TeamRole;
	private andCondition = true;
	private orCondition = false;

	private destroyRef = inject(DestroyRef);
	private ngIfDirective = inject(NgIf);
	private sessionService = inject(SessionService);
	private authorizationService = inject(AuthorizationService);
	private teamAuthorizationService = inject(TeamAuthorizationService);

	@Input()
	set hasTeamRole(team: Pick<Team, '_id'>) {
		this.team = team;
		this.updateNgIf();
	}

	@Input()
	set hasTeamRoleRole(role: string | TeamRole) {
		this.role = role;
		this.updateNgIf();
	}

	@Input()
	set hasTeamRoleAnd(condition: boolean) {
		this.andCondition = condition;
		this.updateNgIf();
	}

	@Input()
	set hasTeamRoleOr(condition: boolean) {
		this.orCondition = condition;
		this.updateNgIf();
	}

	ngOnInit() {
		this.sessionService
			.getSession()
			.pipe(takeUntilDestroyed(this.destroyRef))
			.subscribe(() => {
				this.updateNgIf();
			});
	}

	protected checkPermission(): boolean {
		return (
			this.authorizationService.isAdmin() ||
			this.teamAuthorizationService.hasRole(this.team, this.role)
		);
	}

	private updateNgIf() {
		this.ngIfDirective.ngIf = this.orCondition || (this.andCondition && this.checkPermission());
	}
}
