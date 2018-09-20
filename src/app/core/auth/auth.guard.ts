import { Injectable } from '@angular/core';
import { CanActivate, Router, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import * as _ from 'lodash';

import { forkJoin, Observable, of } from 'rxjs';
import { catchError, first, map } from 'rxjs/operators';

import { Config } from '../config.model';
import { ConfigService } from '../config.service';
import { Session } from './session.model';
import { SessionService } from './session.service';

@Injectable()
export class AuthGuard implements CanActivate {

	constructor(
		private configService: ConfigService,
		private router: Router,
		private sessionService: SessionService
	) { }


	canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {

		// Default to requiring authentication if guard is present
		let requiresAuthentication: boolean = true;
		if (_.get(route, 'data.requiresAuthentication', true) === false) {
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

		return this.configService.getConfig().pipe(
			first(),
			catchError((error) => {
				// Handle the error
				console.log(error);
				return of(null);
			}),
			map<Config, boolean>((config: any): boolean => {

				// An error occurred
				if (null == config) {
					// TODO: route to an error page
					return false;
				}

				// Get the existing session
				const session: Session = this.sessionService.getSession();

				// The user isn't authenticated
				if (session == null) {
					// Send them to signin with a redirect to the previous URL
					this.sessionService.setPreviousUrl(state.url);
					this.router.navigate(['/signin']);
					return false;
				}

				return true;

			})
		);

	}

}
