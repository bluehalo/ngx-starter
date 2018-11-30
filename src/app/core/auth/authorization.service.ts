import { Injectable } from '@angular/core';

import get from 'lodash/get';
import indexOf from 'lodash/indexOf';

import { Session } from './session.model';
import { Role } from './role.model';
import { SessionService } from './session.service';

@Injectable()
export class AuthorizationService {

	private session: Session;

	constructor(
		private sessionService: SessionService
	) {
		this.sessionService.getSession().subscribe(
			(session: Session) => {
				this.session = session;
			}
		);
	}

	public isEuaCurrent() {
		let euaPublished: number = get(this.session, 'user.eua.published', 0);
		let euaAccepted: number = get(this.session, 'user.userModel.acceptedEua', 0);

		return euaAccepted >= euaPublished;
	}

	public isAuthenticated(): boolean {
		return (null != this.session && null != this.session.name);
	}

	public hasExternalRole(role: string): boolean {
		let externalRoles = get(this.session, 'user.userModel.externalRoles', []);

		return indexOf(externalRoles, role) !== -1;
	}

	public hasRole(role: string | Role): boolean {
		role = this.roleToString(role);

		let roles = get(this.session, 'user.userModel.roles', {});
		return (null != roles[role]) && roles[role];
	}

	public hasAnyRole(): boolean {
		return Role.ROLES.some((r: Role) => this.hasRole(r.role));
	}

	public hasSomeRoles(roles: Array<string | Role>): boolean {
		return roles.some((role: string | Role) => this.hasRole(role));
	}

	public hasEveryRole(roles: Array<string | Role>): boolean {
		return roles.every((role: string | Role) => this.hasRole(role));
		// return roles.reduce( (p: boolean, c: string) => p && this.hasRole(c), true);
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
