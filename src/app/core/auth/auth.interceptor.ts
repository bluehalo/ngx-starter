import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Router } from '@angular/router';

import get from 'lodash/get';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { SessionService } from './session.service';


/**
 * HTTP Interceptor that will interpret authentication-related HTTP calls
 */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {

	constructor(private router: Router, private sessionService: SessionService) {
		// Nothing here
	}

	intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

		return next.handle(req).pipe(
			catchError((err) => {

				// Grab all the useful stuff out of the error response
				const status = get(err, 'status', 200);
				const type = get(err, 'error.type', '');
				const url = get(err, 'url', '');
				const message = get(err, 'error.message', '');

				const routeObject = { status, type, message, url };

				// Go to signin if the user isn't logged in and wasn't already on the signin page
				if (401 === status && !url.endsWith('auth/signin')) {
					this.router.navigate(['/signin']);

				}

				// If it was anything other 400 error, take them to the access problem page
				else if (403 === status) {
					if ('eua' === type) {
						this.router.navigate(['/eua']);
					}
					else {
						this.router.navigate(['/access', routeObject]);
					}
				}

				return throwError(err);

			})
		);

	}

}
