import difference from 'lodash/difference';
import findIndex from 'lodash/findIndex';

import { User } from '../auth/user.model';
import { Team } from './team.model';
import { TeamRole } from './team-role.model';

export class TeamMember extends User {
	public explicit = false;

	public active = false;

	public role = 'member';

	public roleDisplay: string;

	constructor() {
		super();
	}

	hasTeams(): boolean {
		return this.userModel.teams.length > 0;
	}

	public getRoleInTeam(team: Team | { _id: string }): string {
		if (null != this.userModel) {
			const teams = this?.userModel?.teams ?? [];
			// Find the role of this user in the team
			const ndx = findIndex(teams, (t: any) => t._id === team._id);

			if (-1 !== ndx) {
				return teams[ndx].role;
			}
		}

		return null;
	}

	public setFromTeamMemberModel(team: Team, userModel: any): TeamMember {
		// Set the user model
		super.setFromUserModel(userModel);

		if (null != this.userModel) {
			// Initialize the teams array if needed
			if (null == userModel.teams) {
				this.userModel.teams = [];
			} else if (null != team) {
				this.role = this.getRoleInTeam(team);
				this.roleDisplay = TeamRole.getDisplay(this.role);
			}

			// Determine if user is implicit/explicit and active/inactive
			this.explicit = (userModel.teams?.length ?? 0) > 0;

			if (userModel.bypassAccessCheck) {
				this.active = true;
			} else if (null != team) {
				this.active =
					0 === difference(team.requiresExternalTeams, userModel.externalGroups).length;
			}
		}

		return this;
	}
}
