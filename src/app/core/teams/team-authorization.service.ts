import { Injectable } from '@angular/core';

import { untilDestroyed, UntilDestroy } from '@ngneat/until-destroy';
import { first, map } from 'rxjs/operators';
import { Session } from '../auth/session.model';
import { SessionService } from '../auth/session.service';
import { TeamMember } from './team-member.model';
import { TeamRole } from './team-role.model';
import { Team } from './team.model';

type TeamIdObj = Team | { _id: string };

@UntilDestroy()
@Injectable()
export class TeamAuthorizationService {
	private member: TeamMember;

	constructor(private sessionService: SessionService) {
		this.sessionService
			.getSession()
			.pipe(
				first(),
				map((session: Session) =>
					new TeamMember().setFromTeamMemberModel(null, session.user.userModel)
				),
				untilDestroyed(this)
			)
			.subscribe((member: TeamMember) => {
				this.member = member;
			});
	}

	hasTeams(): boolean {
		return this.member.userModel.teams.length > 0;
	}

	public hasRole(team: TeamIdObj, role: string | TeamRole): boolean {
		role = this.roleToString(role);
		return this.member.getRoleInTeam(team) === role;
	}

	public hasAnyRole(team: TeamIdObj): boolean {
		return TeamRole.ROLES.some((role: TeamRole) => this.hasRole(team, role));
	}

	public hasSomeRoles(team: TeamIdObj, roles: Array<string | TeamRole>): boolean {
		return roles.some((role: string | TeamRole) => this.hasRole(team, role));
	}

	public hasEveryRole(team: TeamIdObj, roles: Array<string | TeamRole>): boolean {
		return roles.every((role: string | TeamRole) => this.hasRole(team, role));
		// return roles.reduce( (p: boolean, c: string) => p && this.hasRole(c), true);
	}

	public isMember(team: TeamIdObj): boolean {
		return this.hasRole(team, TeamRole.VIEW_ONLY.role);
	}

	public isEditor(team: TeamIdObj): boolean {
		return this.hasRole(team, TeamRole.EDITOR.role);
	}

	public canManageResources(team: TeamIdObj): boolean {
		return this.isAdmin(team) || this.isEditor(team);
	}

	public isAdmin(team: TeamIdObj): boolean {
		return this.hasRole(team, TeamRole.ADMIN.role);
	}

	private roleToString(role: string | TeamRole) {
		if (typeof role !== 'string') {
			return role.role;
		}
		return role;
	}
}
