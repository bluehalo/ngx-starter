import { Injectable, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { map } from 'rxjs/operators';

import { SessionService } from '../auth/session.service';
import { TeamMember } from './team-member.model';
import { TeamRole } from './team-role.model';
import { Team } from './team.model';

@Injectable({
	providedIn: 'root'
})
export class TeamAuthorizationService {
	private member!: TeamMember;

	private sessionService = inject(SessionService);

	constructor() {
		this.sessionService
			.getSession()
			.pipe(
				map((session) => new TeamMember(session?.user)),
				takeUntilDestroyed()
			)
			.subscribe((member: TeamMember) => {
				this.member = member;
			});
	}

	public hasRole(team: Pick<Team, '_id'>, role: string | TeamRole): boolean {
		role = this.roleToString(role);
		return this.member.getRoleInTeam(team) === role;
	}

	public hasAnyRole(team: Pick<Team, '_id'>): boolean {
		return TeamRole.ROLES.some((role: TeamRole) => this.hasRole(team, role));
	}

	public hasSomeRoles(team: Pick<Team, '_id'>, roles: Array<string | TeamRole>): boolean {
		return roles.some((role: string | TeamRole) => this.hasRole(team, role));
	}

	public hasEveryRole(team: Pick<Team, '_id'>, roles: Array<string | TeamRole>): boolean {
		return roles.every((role: string | TeamRole) => this.hasRole(team, role));
		// return roles.reduce( (p: boolean, c: string) => p && this.hasRole(c), true);
	}

	public isMember(team: Pick<Team, '_id'>): boolean {
		return this.hasRole(team, TeamRole.MEMBER.role);
	}

	public isEditor(team: Pick<Team, '_id'>): boolean {
		return this.hasRole(team, TeamRole.EDITOR.role);
	}

	public canManageResources(team: Pick<Team, '_id'>): boolean {
		return this.isAdmin(team) || this.isEditor(team);
	}

	public isAdmin(team: Pick<Team, '_id'>): boolean {
		return this.hasRole(team, TeamRole.ADMIN.role);
	}

	private roleToString(role: string | TeamRole) {
		if (typeof role !== 'string') {
			return role?.role;
		}
		return role;
	}
}
