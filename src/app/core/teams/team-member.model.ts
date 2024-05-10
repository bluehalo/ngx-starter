import { User } from '../auth';
import { TeamRole } from './team-role.model';
import { Team } from './team.model';

export class TeamMember extends User {
	public explicit = false;

	public role = 'member';

	public roleDisplay = TeamRole.getDisplay(this.role);

	constructor(model: any, team?: Team) {
		super(model);
		this.setFromModelAndTeam(model, team);
	}

	private setFromModelAndTeam(model: any, team?: Team): TeamMember {
		if (!model) {
			return this;
		}

		// Determine if user is implicit/explicit and active/inactive
		this.explicit = (model.teams?.length ?? 0) > 0;

		if (team) {
			this.role = this.getTeamRole(team) ?? TeamRole.MEMBER.role;
			this.roleDisplay = TeamRole.getDisplay(this.role);

			this.explicit = model.teams.map((t: any) => t._id).includes(team._id);
		}

		return this;
	}
}
