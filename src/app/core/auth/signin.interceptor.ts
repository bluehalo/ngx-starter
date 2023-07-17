import { HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

import { Observable } from 'rxjs';

import { errorInterceptor } from './error.interceptor';

/**
 * HTTP Interceptor that will interpret Sign In related HTTP errors
 */
// eslint-disable-next-line rxjs/finnish
export function signinInterceptor(
	req: HttpRequest<unknown>,
	next: HttpHandlerFn
): Observable<HttpEvent<unknown>> {
	const router = inject(Router);

	return errorInterceptor(req, next, ({ status, url }) => {
		if (status === 401 && !url.endsWith('auth/signin')) {
			router.navigate(['/signin']);
		}
	});
}
