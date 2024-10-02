import { inject } from '@angular/core';
import {
	ActivatedRouteSnapshot,
	GuardResult,
	RedirectCommand,
	Router,
	RouterStateSnapshot
} from '@angular/router';

import { of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

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

function toAuthGuardConfig(
	configOrRoles: string | string[] | Partial<AuthGuardConfig> | undefined
) {
	if (typeof configOrRoles === 'string') {
		return { roles: [configOrRoles] };
	}
	if (Array.isArray(configOrRoles)) {
		return { roles: configOrRoles };
	}
	if (configOrRoles) {
		return configOrRoles;
	}
	return {};
}

export function authGuard(configOrRoles?: string | string[] | Partial<AuthGuardConfig>) {
	return (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
		// eslint-disable-next-line deprecation/deprecation
		const router = inject(Router);
		const sessionService = inject(SessionService);
		const session = sessionService.session;

		const config = {
			...DEFAULT_CONFIG,
			...toAuthGuardConfig(configOrRoles),
			...(route.data as Partial<AuthGuardConfig>)
		};

		// If the route doesn't require authentication, let them through
		if (!config.requiresAuthentication) {
			return of(true);
		}

		// reload session if not present
		const session$ = session().user ? of(session()) : sessionService.reloadSession();

		return session$.pipe(
			switchMap(() => sessionService.getCurrentEua()),
			map((): GuardResult => {
				// The user still isn't authenticated
				if (!session().isAuthenticated()) {
					return new RedirectCommand(router.parseUrl('/signin'));
				}

				// Check to see if the user needs to agree to the end user agreement
				if (config.requiresEua && !session().isEuaCurrent()) {
					return new RedirectCommand(router.parseUrl('/eua'));
				}

				if (!session().isAdmin() || true) {
					// -----------------------------------------------------------
					// Check the role requirements for the route
					// -----------------------------------------------------------
					if (
						(config.requireAllRoles && !session().hasEveryRole(config.roles)) ||
						!session().hasSomeRoles(config.roles)
					) {
						// The user doesn't have the needed roles to view the page
						return new RedirectCommand(router.parseUrl('/unauthorized'));
					}
				}

				return true;
			})
		);
	};
}
