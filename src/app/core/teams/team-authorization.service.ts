import { Injectable, inject } from '@angular/core';

import { APP_SESSION } from '../tokens';
import { TeamRole } from './team-role.model';
import { Team } from './team.model';

/**
 * @deprecated Implementation moved to Session.
 */
@Injectable({
	providedIn: 'root'
})
export class TeamAuthorizationService {
	readonly #session = inject(APP_SESSION);

	public hasRole(team: Pick<Team, '_id'>, role: string | TeamRole): boolean {
		return this.#session().hasTeamRole(team, role);
	}

	public hasAnyRole(team: Pick<Team, '_id'>): boolean {
		return this.#session().hasSomeTeamRoles(team, TeamRole.ROLES);
	}

	public hasSomeRoles(team: Pick<Team, '_id'>, roles: Array<string | TeamRole>): boolean {
		return this.#session().hasSomeTeamRoles(team, roles);
	}

	public hasEveryRole(team: Pick<Team, '_id'>, roles: Array<string | TeamRole>): boolean {
		return this.#session().hasEveryTeamRole(team, roles);
	}

	public isMember(team: Pick<Team, '_id'>): boolean {
		return this.#session().hasTeamRole(team, TeamRole.MEMBER);
	}

	public isEditor(team: Pick<Team, '_id'>): boolean {
		return this.#session().hasTeamRole(team, TeamRole.EDITOR);
	}

	public isAdmin(team: Pick<Team, '_id'>): boolean {
		return this.#session().hasRole(TeamRole.ADMIN);
	}

	public canManageResources(team: Pick<Team, '_id'>): boolean {
		return this.#session().hasSomeTeamRoles(team, [TeamRole.EDITOR, TeamRole.ADMIN]);
	}
}
