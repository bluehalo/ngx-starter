import { HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';

import { Observable, switchMap } from 'rxjs';
import { first, map } from 'rxjs/operators';

import { ConfigService } from '../config.service';
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
		return inject(ConfigService)
			.getConfig()
			.pipe(
				first(),
				map((config) =>
					req.clone({
						setHeaders: {
							[config?.masqueradeHeader ?? DEFAULT_HEADER]: masqDn ?? ''
						}
					})
				),
				switchMap((masReq) => next(masReq))
			);
	}
	return next(req);
}
