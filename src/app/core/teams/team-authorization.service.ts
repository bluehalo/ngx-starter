import { Injectable } from '@angular/core';

import { first, map } from 'rxjs/operators';

import { SessionService } from '../auth/session.service';
import { Session } from '../auth/session.model';

import { Team } from './team.model';
import { TeamRole } from './team-role.model';
import { TeamMember } from './team-member.model';

@Injectable()
export class TeamAuthorizationService {

	private member: TeamMember;

	constructor(
		private sessionService: SessionService
	) {
		this.sessionService.getSession()
			.pipe(
				first(),
				map((session: Session) => new TeamMember().setFromTeamMemberModel(null, session.user.userModel))
			).subscribe((member: TeamMember) => {
				this.member = member;
			});
	}

	hasTeams(): boolean {
		return this.member.userModel.teams.length > 0;
	}

	public hasRole(team: Team, role: string | TeamRole): boolean {
		role = this.roleToString(role);
		return this.member.getRoleInTeam(team) === role;
	}

	public hasAnyRole(team: Team): boolean {
		return TeamRole.ROLES.some((role: TeamRole) => this.hasRole(team, role));
	}

	public hasSomeRoles(team: Team, roles: Array<string | TeamRole>): boolean {
		return roles.some((role: string | TeamRole) => this.hasRole(team, role));
	}

	public hasEveryRole(team: Team, roles: Array<string | TeamRole>): boolean {
		return roles.every((role: string | TeamRole) => this.hasRole(team, role));
		// return roles.reduce( (p: boolean, c: string) => p && this.hasRole(c), true);
	}

	public isMember(team: Team): boolean {
		return this.hasRole(team, TeamRole.VIEW_ONLY.role);
	}

	public isEditor(team: Team): boolean {
		return this.hasRole(team, TeamRole.EDITOR.role);
	}

	public isAdmin(team: Team): boolean {
		return this.hasRole(team, TeamRole.ADMIN.role);
	}

	private roleToString(role: string | TeamRole) {
		if (typeof role !== 'string') {
			return role.role;
		}
		return role;
	}
}
