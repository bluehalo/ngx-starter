import { User } from '../auth';
import { TeamRole } from './team-role.model';
import { Team } from './team.model';

export class TeamMember extends User {
	public explicit = false;

	public role = 'member';

	public roleDisplay = TeamRole.getDisplay(this.role);

	constructor(model: unknown, team?: Pick<Team, '_id'>) {
		super(model);
		this.setFromTeam(team);
	}

	private setFromTeam(team?: Pick<Team, '_id'>): TeamMember {
		// Determine if user is implicit/explicit and active/inactive
		this.explicit = (this.teams?.length ?? 0) > 0;

		if (team) {
			this.role = this.getTeamRole(team) ?? TeamRole.MEMBER.role;
			this.roleDisplay = TeamRole.getDisplay(this.role);

			this.explicit = this.teams.map((t) => t._id).includes(team._id);
		}

		return this;
	}
}
