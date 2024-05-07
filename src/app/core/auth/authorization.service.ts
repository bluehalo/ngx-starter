import { Injectable, inject } from '@angular/core';

import { APP_SESSION } from '../tokens';
import { Role } from './role.model';

/**
 * @deprecated Implementation moved to Session.
 */
@Injectable({ providedIn: 'root' })
export class AuthorizationService {
	#session = inject(APP_SESSION);

	public isEuaCurrent() {
		return this.#session().isEuaCurrent();
	}

	public isAuthenticated(): boolean {
		return this.#session().isAuthenticated();
	}

	public hasExternalRole(role: string): boolean {
		return this.#session().hasExternalRole(role);
	}

	public hasRole(role: string | Role): boolean {
		return this.#session().hasRole(role);
	}

	public hasAnyRole(): boolean {
		return this.#session().hasAnyRole();
	}

	public hasSomeRoles(roles: Array<string | Role>): boolean {
		return this.#session().hasSomeRoles(roles);
	}

	public hasEveryRole(roles: Array<string | Role>): boolean {
		return this.#session().hasEveryRole(roles);
	}

	public isUser(): boolean {
		return this.#session().isUser();
	}

	public isAdmin(): boolean {
		return this.#session().isAdmin();
	}
}
