import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { throwError, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

/**
 * HTTP Interceptor that will interpret authentication-related HTTP calls
 */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
	constructor(public router: Router) {}

	intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		return next.handle(req).pipe(
			catchError(err => {
				if (err.bypassAuthInterceptors) {
					this.handleError(err);
				}
				return throwError(err);
			})
		);
	}

	/**
	 * Grab all the useful stuff out of the error response
	 */
	parseError(err: any) {
		const status = err?.status ?? 200;
		const type = err?.error?.type ?? '';
		const url = err?.url ?? '';
		const message = err?.error?.message ?? '';

		return { status, type, message, url };
	}

	/**
	 * Set a flag in the error to alert future interceptors to pass the error through
	 */
	bypassRemainingInterceptors(err: any) {
		err.bypassAuthInterceptors = true;
	}

	/**
	 * Default error handler. Override this in any interceptors extending the AuthInterceptor class
	 */
	handleError(err: any): void {
		this.router.navigate(['/access'], { state: this.parseError(err) });
	}
}
