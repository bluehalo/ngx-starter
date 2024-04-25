import { HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';

import { Observable } from 'rxjs';

import { APP_CONFIG } from '../config.service';
import { MasqueradeService } from './masquerade.service';

const DEFAULT_HEADER = 'x-masquerade-user-dn';

/**
 * HTTP Interceptor that will add Masquerade related headers
 */
// eslint-disable-next-line rxjs/finnish
export function masqueradeInterceptor(
	req: HttpRequest<unknown>,
	next: HttpHandlerFn
): Observable<HttpEvent<unknown>> {
	const masqDn = inject(MasqueradeService).getMasqueradeDn();
	if (masqDn) {
		return next(
			req.clone({
				setHeaders: {
					[inject(APP_CONFIG)()?.masqueradeHeader ?? DEFAULT_HEADER]: masqDn ?? ''
				}
			})
		);
	}
	return next(req);
}
