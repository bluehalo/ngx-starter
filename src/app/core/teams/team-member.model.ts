import { User } from '../auth/user.model';
import { TeamRole } from './team-role.model';
import { Team } from './team.model';

export class TeamMember extends User {
	public explicit = false;

	public role = 'member';

	public roleDisplay = TeamRole.getDisplay(this.role);

	constructor(model: any, team?: Team) {
		super();
		if (model) {
			this.setFromTeamMemberModel(team, model);
		}
	}

	private setFromTeamMemberModel(model: any, team?: Team): TeamMember {
		if (null == model) {
			return this;
		}

		// Determine if user is implicit/explicit and active/inactive
		this.explicit = (model.teams?.length ?? 0) > 0;

		if (team) {
			this.role = this.getRoleInTeam(team) ?? TeamRole.MEMBER.role;
			this.roleDisplay = TeamRole.getDisplay(this.role);

			this.explicit = model.teams.map((t: any) => t._id).includes(team._id);
		}

		return this;
	}

	public getRoleInTeam(team: Pick<Team, '_id'>): string | null {
		const teams = this?.teams ?? [];
		// Find the role of this user in the team
		const ndx = teams.findIndex((t: any) => t._id === team._id);

		if (-1 !== ndx) {
			return teams[ndx].role;
		}

		return null;
	}
}
