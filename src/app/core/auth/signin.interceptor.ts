import { Injectable } from '@angular/core';

import { Interceptor } from './interceptor';

/**
 * HTTP Interceptor that will interpret Sign In related HTTP calls
 */
@Injectable()
export class SigninAuthInterceptor extends Interceptor {
	handleError(err: any): void {
		const { status, url } = this.parseError(err);
		if (status === 401 && !url.endsWith('auth/signin')) {
			this.router.navigate(['/signin']);
			this.bypassRemainingInterceptors(err);
		}
	}
}
