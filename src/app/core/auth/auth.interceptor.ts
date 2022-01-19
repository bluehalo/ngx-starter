import { HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { AbstractHttpInterceptor } from './abstract.interceptor';

/**
 * HTTP Interceptor that will interpret authentication related HTTP calls
 */
@Injectable()
export class AuthInterceptor extends AbstractHttpInterceptor {
	handleError(err: unknown, req: HttpRequest<any>): void {
		if (!req.headers.has('bypass-auth-interceptor')) {
			const { status, type, message, url } = this.parseError(err);
			if (status === 403) {
				this.router.navigate(['/access'], { state: { status, type, message, url } });
			}
		}
	}
}
