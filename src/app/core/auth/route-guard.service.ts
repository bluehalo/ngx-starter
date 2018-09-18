import { Injectable } from '@angular/core';
import { CanActivate, Router, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import * as _ from 'lodash';

import { Observable, Observer, of } from 'rxjs';

import { SessionService } from './session.service';
import { AuthenticationService } from './authentication.service';

@Injectable()
export class RouteGuardService implements CanActivate {

	constructor(
		private sessionService: SessionService,
		private router: Router
	) { }


	canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {

		// Default to requiring authentication if guard is present
		let requiresAuthentication: boolean = true;
		if (_.get(route, 'data.requiresAuthentication', true) === false) {
			requiresAuthentication = false;
		}

		// -----------------------------------------------------------
		// Does the user need to log in?
		// -----------------------------------------------------------

		// If the route doesn't require authentication, let them through
		if (!requiresAuthentication) {
			return of(true);
		}

		else if (!this.sessionService.isAuthenticated()) {
			// Store the attempted URL so we can redirect after successful login
			this.sessionService.previousUrl = url;
			this.router.navigate(['/signin']);
			return false;
		}

	}


	protected checkAccess(url: string, route: ActivatedRouteSnapshot): Observable<boolean> {


		// If the route requires authentication and the user is not authenticated, then go to the signin route


		// -----------------------------------------------------------
		// Does the user need to accept the user agreement?
		// -----------------------------------------------------------

		// Check to see if the user needs to agree to the end user agreement
		else if (url !== '/user-eua' && this.sessionService.requiresEua()) {
			this.sessionService.previousUrl = url;
			this.router.navigate(['/user-eua']);
			return false;
		}

		// -----------------------------------------------------------
		// Does the user have all required roles?
		// -----------------------------------------------------------
		else if (!this.sessionService.hasRoles()) {

			if (this.sessionService.isAuthenticated() && !this.sessionService.hasRole('user')) {

				// If the user is missing the user role, they are pending
				if (url !== '/inactive-user') {
					this.sessionService.previousUrl = url;
					this.router.navigate(['/inactive-user']);
					return false;
				}
			}
			else {
				// The user doesn't have the needed roles to view the page
				if (url !== '/unauthorized') {
					this.sessionService.previousUrl = url;
					this.router.navigate(['/unauthorized']);
					return false;
				}
			}

		}

		return this.checkAdminAccess(url, route);
	}

	protected checkAdminAccess(url: string, route: ActivatedRouteSnapshot): boolean {
		return this.sessionService.user.isAdmin();
		if (!this.sessionService.user.isAdmin()) {
			// -----------------------------------------------------------
			// Check the role requirements for the route
			// -----------------------------------------------------------

			// compile a list of roles that are missing
			let requiredRoles = (null != route.data && null != (route.data as any).roles) ? (route.data as any).roles : ['user'];
			let missingRoles: any[] = [];
			requiredRoles.forEach( (role: any) => {
				if (!this.sessionService.hasRole(role)) {
					missingRoles.push(role);
				}
			});

			// If there are roles missing then we need to do something
			if (missingRoles.length > 0) {

				if (this.sessionService.isAuthenticated() && !this.sessionService.hasRole('user')) {

					// If the user is missing the user role, they are pending
					if (url !== '/inactive-user') {
						this.sessionService.previousUrl = url;
						this.router.navigate(['/inactive-user']);
						return false;
					}
				}
				else {
					// The user doesn't have the needed roles to view the page
					if (url !== '/unauthorized') {
						this.sessionService.previousUrl = url;
						this.router.navigate(['/unauthorized']);
						return false;
					}
				}

			}
		}

		return true;
	}

}
