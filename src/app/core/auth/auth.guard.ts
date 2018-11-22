import { Injectable } from '@angular/core';
import { CanActivate, Router, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';

import get from 'lodash/get';
import { Observable, of } from 'rxjs';
import { catchError, first, map, switchMap } from 'rxjs/operators';

import { ConfigService } from '../config.service';
import { SessionService } from './session.service';

import { Session } from './session.model';
import { AuthorizationService } from './authorization.service';
import { Role } from './role.model';

@Injectable()
export class AuthGuard implements CanActivate {

	constructor(
		private router: Router,
		private sessionService: SessionService,
		private authorizationService: AuthorizationService
	) { }


	canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {

		// Default to requiring authentication if guard is present
		let requiresAuthentication: boolean = true;
		if (get(route, 'data.requiresAuthentication', true) === false) {
			requiresAuthentication = false;
		}

		// -----------------------------------------------------------
		// Does the user need to be authenticated?
		// -----------------------------------------------------------

		// If the route doesn't require authentication, let them through
		if (!requiresAuthentication) {
			return of(true);
		}


		// -----------------------------------------------------------
		// Yes, the user needs to be authenticated
		// -----------------------------------------------------------

		return this.sessionService.getSession().pipe(
			first(),
			catchError((error) => {
				// Handle the error
				console.log(error);
				return of(null);
			}),
			switchMap((session) => {
				// The user isn't authenticated, try reloading
				if (session == null) {
					return this.sessionService.reloadSession();
				}
				return of(session);
			}),
			map((session) => {
				return this.checkAccess(route, state, session);
			})
		);
	}

	checkAccess(route: ActivatedRouteSnapshot, state: RouterStateSnapshot, session: Session): boolean {
		// The user still isn't authenticated
		if (!this.authorizationService.isAuthenticated()) {
			// Send them to signin with a redirect to the previous URL
			this.sessionService.setPreviousUrl(state.url);
			this.router.navigate(['/signin']);
			return false;
		}


		if (!this.authorizationService.isAdmin()) {
			// -----------------------------------------------------------
			// Check the role requirements for the route
			// -----------------------------------------------------------

			// compile a list of roles that are missing
			let requiredRoles = get(route, 'data.roles', ['user']);
			let missingRoles: any[] = [];
			requiredRoles.forEach( (role: any) => {
				if (!this.authorizationService.hasRole(role)) {
					missingRoles.push(role);
				}
			});

			// If there are roles missing then we need to do something
			if (missingRoles.length > 0) {

				if (!this.authorizationService.hasRole(Role.USER)) {
					// If the user is missing the user role, they are pending
					if (state.url !== '/inactive-user') {
						this.sessionService.setPreviousUrl(state.url);
						this.router.navigate(['/inactive-user']);
						return false;
					}
				} else {
					// The user doesn't have the needed roles to view the page
					if (state.url !== '/unauthorized') {
						this.sessionService.setPreviousUrl(state.url);
						this.router.navigate(['/unauthorized']);
						return false;
					}
				}

			}
		}

		// if (this.userStateService.user.missingExternalRoles.length > 0 && !this.userStateService.isBypassed()) {
		// 	if (url !== '/no-access') {
		// 		this.router.navigate(['/no-access']);
		// 		return false;
		// 	}
		// }






		return true;
	}

}
