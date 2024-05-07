import { Role } from './role.model';
import { User } from './user.model';

export class Session {
	public user?: User;

	constructor(public userModel?: unknown) {
		if (userModel) {
			this.user = new User(userModel);
		}
	}

	public isAuthenticated(): boolean {
		return this.user?.name != null;
	}

	public isEuaCurrent() {
		const euaPublished = new Date(this.user?.eua?.published ?? 0).getTime();
		const euaAccepted = new Date(this.user?.acceptedEua ?? 0).getTime();
		return euaAccepted >= euaPublished;
	}

	public hasExternalRole(role: string): boolean {
		const externalRoles = this.user?.externalRoles ?? [];

		return externalRoles.indexOf(role) !== -1;
	}

	public hasRole(role: string | Role): boolean {
		role = this.roleToString(role);

		const roles = this.user?.roles ?? {};
		return null != roles[role] && roles[role];
	}

	public hasAnyRole(): boolean {
		return Role.ROLES.some((r: Role) => this.hasRole(r.role));
	}

	public hasSomeRoles(roles: Array<string | Role>): boolean {
		return roles.some((role: string | Role) => this.hasRole(role));
	}

	public hasEveryRole(roles: Array<string | Role>): boolean {
		return roles.every((role: string | Role) => this.hasRole(role));
	}

	public isUser(): boolean {
		return this.hasRole(Role.USER.role);
	}

	public isAdmin(): boolean {
		return this.hasRole(Role.ADMIN.role);
	}

	private roleToString(role: string | Role) {
		if (typeof role !== 'string') {
			return role.role;
		}
		return role;
	}
}
