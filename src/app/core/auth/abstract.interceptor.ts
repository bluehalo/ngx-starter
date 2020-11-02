import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { throwError, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

/**
 * Abstract HTTP Interceptor
 */
@Injectable()
export abstract class AbstractHttpInterceptor implements HttpInterceptor {
	protected constructor(public router: Router) {}

	intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		return next.handle(req).pipe(
			catchError(err => {
				this.handleError(err, req);
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
	 * Implement this in any interceptors extending the AuthInterceptor class
	 */
	abstract handleError(err: any, req: HttpRequest<any>): void;
}
