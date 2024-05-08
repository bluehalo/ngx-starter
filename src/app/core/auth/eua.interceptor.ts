import { HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

import { Observable } from 'rxjs';

import { errorInterceptor } from './error.interceptor';

/**
 * HTTP Interceptor that will interpret EUA related HTTP calls
 */
// eslint-disable-next-line rxjs/finnish
export function euaInterceptor(
	req: HttpRequest<unknown>,
	next: HttpHandlerFn
): Observable<HttpEvent<unknown>> {
	const router = inject(Router);

	return errorInterceptor(req, next, ({ status, message }) => {
		if (status === 403 && message === 'User must accept end-user agreement.') {
			router.navigate(['/eua']);
			return true;
		}
		return false;
	});
}
