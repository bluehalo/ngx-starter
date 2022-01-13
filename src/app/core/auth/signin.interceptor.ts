import { Injectable } from '@angular/core';

import { AbstractHttpInterceptor } from './abstract.interceptor';

/**
 * HTTP Interceptor that will interpret Sign In related HTTP calls
 */
@Injectable()
export class SigninInterceptor extends AbstractHttpInterceptor {
	handleError(err: unknown): void {
		const { status, url } = this.parseError(err);
		if (status === 401 && !url.endsWith('auth/signin')) {
			this.router.navigate(['/signin']);
		}
	}
}
