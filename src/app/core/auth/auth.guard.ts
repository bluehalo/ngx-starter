import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';

import { Observable, of } from 'rxjs';
import { first, map, switchMap } from 'rxjs/operators';

import { APP_CONFIG } from '../config.service';
import { AuthorizationService } from './authorization.service';
import { SessionService } from './session.service';

type AuthGuardConfig = {
	requiresAuthentication: boolean;
	requiresEua: boolean;
	requireAllRoles: boolean;
	roles: string[];
};

const DEFAULT_CONFIG: AuthGuardConfig = {
	requiresAuthentication: true,
	requiresEua: true,
	requireAllRoles: true,
	roles: ['user']
};

export function authGuard(configOrRoles?: string | string[] | Partial<AuthGuardConfig>) {
	let config: Partial<AuthGuardConfig> = {};
	if (typeof configOrRoles === 'string') {
		config.roles = [configOrRoles];
	} else if (Array.isArray(configOrRoles)) {
		config.roles = configOrRoles;
	} else if (configOrRoles) {
		config = configOrRoles;
	}

	return (
		route: ActivatedRouteSnapshot,
		state: RouterStateSnapshot, // eslint-disable-next-line deprecation/deprecation
		service = inject(AuthGuard)
	) => {
		const mergedConfig = {
			...DEFAULT_CONFIG,
			...config,
			...(route.data as Partial<AuthGuardConfig>)
		};

		return service.canActivate(route, state, mergedConfig);
	};
}

/**
 * @deprecated AuthGuard class will be removed in favor of functional guard.
 */
@Injectable({
	providedIn: 'root'
})
export class AuthGuard {
	private router = inject(Router);
	private sessionService = inject(SessionService);
	private authorizationService = inject(AuthorizationService);
	private appConfig = inject(APP_CONFIG);

	canActivate(
		route: ActivatedRouteSnapshot,
		state: RouterStateSnapshot,
		config: AuthGuardConfig = DEFAULT_CONFIG
	): Observable<boolean | UrlTree> {
		// -----------------------------------------------------------
		// Does the user need to be authenticated?
		// -----------------------------------------------------------

		// If the route doesn't require authentication, let them through
		if (!config.requiresAuthentication) {
			return of(true);
		}

		// -----------------------------------------------------------
		// Yes, the user needs to be authenticated
		// -----------------------------------------------------------
		return this.sessionService.getSession().pipe(
			first(),
			switchMap((session) => {
				// The user isn't authenticated, try reloading
				if (session === null && this.appConfig()?.auth !== 'proxy-pki') {
					return this.sessionService.reloadSession();
				}
				return of(session);
			}),
			switchMap(() =>
				this.authorizationService.isAuthenticated()
					? this.sessionService.getCurrentEua()
					: of(null)
			),
			map(() => this.checkAccess(state, config))
		);
	}

	checkAccess(state: RouterStateSnapshot, config: AuthGuardConfig): boolean | UrlTree {
		// The user still isn't authenticated
		if (!this.authorizationService.isAuthenticated()) {
			return this.router.parseUrl('/signin');
		}

		if (!this.authorizationService.isAdmin()) {
			// -----------------------------------------------------------
			// Does the user need to accept the user agreement??
			// -----------------------------------------------------------
			// Check to see if the user needs to agree to the end user agreement
			// Default to requiring authentication if guard is present
			if (config.requiresEua && !this.authorizationService.isEuaCurrent()) {
				return this.router.parseUrl('/eua');
			}

			// -----------------------------------------------------------
			// Check the role requirements for the route
			// -----------------------------------------------------------

			// compile a list of roles that are missing
			const missingRoles: any[] = [];
			const userRoles: any[] = [];
			config.roles.forEach((role: any) => {
				if (!this.authorizationService.hasRole(role)) {
					missingRoles.push(role);
				} else {
					userRoles.push(role);
				}
			});

			// If there are roles missing then we need to do something
			if (
				((missingRoles.length > 0 && config.requireAllRoles) ||
					(userRoles.length === 0 && config.roles.length > 0)) &&
				state.url !== '/unauthorized'
			) {
				// The user doesn't have the needed roles to view the page
				return this.router.parseUrl('/unauthorized');
			}
		}

		return true;
	}
}
