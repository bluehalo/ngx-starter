import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpParams, HttpRequest, HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';

import * as _ from 'lodash';
import { EMPTY as OBSERVABLE_EMPTY, Observable, throwError as ObservableThrowError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { SessionService } from './session.service';


/**
 * HTTP Interceptor that will interpret authentication-related HTTP calls
 */
@Injectable()
export class AuthHttpInterceptor implements HttpInterceptor {

	constructor(private router: Router, private sessionService: SessionService) {
		// Nothing here
	}

	intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

		return next.handle(req).pipe(
			catchError((err) => {

				const type = err.error.type;
				switch (err.status) {
					case 401:

						// Deauthenticate the global user
						this.sessionService.clear();

						if (type === 'invalid-certificate') {
							// Redirect to invalid credentials page
							this.router.navigate(['/invalid-certificate']);
						}
						else {
							// Signin protection is handled by the AuthGuard on specific routes
						}

						break;
					case 403:
						if (type === 'eua') {
							this.router.navigate(['/user-eua']);
						}
						else if (type === 'inactive') {
							this.router.navigate(['/inactive-user']);
						}
						else if (type === 'noaccess') {
							this.router.navigate(['/no-access']);
						}
						else if (type === 'redirect') {
							window.location.href = err.error.url;
						}
						else {
							// Add unauthorized behavior
							this.router.navigate(['/unauthorized']);
						}
						break;

					default:
						break;
				}

				if (err.status === 401
					&& !_.endsWith(err.url, 'auth/signin')) {
					if (!_.endsWith(err.url, 'user/me')) {
						this.router.navigate(['/signin']);
					}
					return OBSERVABLE_EMPTY;
				}
				else {
					return ObservableThrowError(err);
				}

			})
		);

	}

}
