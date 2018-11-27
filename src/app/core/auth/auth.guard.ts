import { Injectable } from '@angular/core';
import { CanActivate, Router, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';

import get from 'lodash/get';
import { Observable, of } from 'rxjs';
import { catchError, first, map, switchMap } from 'rxjs/operators';

import { ConfigService } from '../config.service';
import { SessionService } from './session.service';

import { Session } from './session.model';
import { AuthorizationService } from './authorization.service';

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
			switchMap(() => {
				return this.authorizationService.isAuthenticated() ? this.sessionService.getCurrentEua() : of(null);
			}),
			map(() => {
				return this.checkAccess(route, state);
			})
		);
	}

	checkAccess(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
		// Default to requiring authentication if guard is present
		let requiresEua: boolean = true;
		if (get(route, 'data.requiresEua', true) === false) {
			requiresEua = false;
		}

		// The user still isn't authenticated
		if (!this.authorizationService.isAuthenticated()) {
			// Send them to signin with a redirect to the previous URL
			this.sessionService.setPreviousUrl(state.url);
			this.router.navigate(['/signin']);
			return false;
		}

		if (!this.authorizationService.isAdmin()) {
			// -----------------------------------------------------------
			// Does the user need to accept the user agreement??
			// -----------------------------------------------------------
			// Check to see if the user needs to agree to the end user agreement
			if (!this.authorizationService.isEuaCurrent()) {
				if (requiresEua) {
					this.sessionService.setPreviousUrl(state.url);
					this.router.navigate(['/user-eua']);
					return false;
				}
			}

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

				if (!this.authorizationService.isUser()) {
					// If the user is missing the user role, they are pending
					this.sessionService.setPreviousUrl(state.url);
					this.router.navigate(['/inactive']);
					return false;
				} else {
					// The user doesn't have the needed roles to view the page
					this.sessionService.setPreviousUrl(state.url);
					this.router.navigate(['/unauthorized']);
					return false;
				}

			}
		}

		return true;
	}

}
