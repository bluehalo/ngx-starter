import { Injectable, computed, inject } from '@angular/core';

import { APP_SESSION } from '../tokens';
import { TeamMember } from './team-member.model';
import { TeamRole } from './team-role.model';
import { Team } from './team.model';

@Injectable({
	providedIn: 'root'
})
export class TeamAuthorizationService {
	readonly #session = inject(APP_SESSION);
	readonly #member = computed(() => new TeamMember(this.#session().user));

	public hasRole(team: Pick<Team, '_id'>, role: string | TeamRole): boolean {
		return this.#member().getRoleInTeam(team) === this.roleToString(role);
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
