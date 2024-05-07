import { HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

import { Observable } from 'rxjs';

import { errorInterceptor } from './error.interceptor';

/**
 * HTTP Interceptor that will interpret authentication related HTTP calls
 */
// eslint-disable-next-line rxjs/finnish
export function authInterceptor(
	req: HttpRequest<unknown>,
	next: HttpHandlerFn
): Observable<HttpEvent<unknown>> {
	const router = inject(Router);

	return errorInterceptor(req, next, (error, req) => {
		if (!req.headers.has('bypass-auth-interceptor') && error.status === 403) {
			router.navigate(['/access'], { state: error });
			return true;
		}
		return false;
	});
}
