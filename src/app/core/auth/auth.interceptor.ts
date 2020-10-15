import { Injectable } from '@angular/core';

import { Interceptor } from './interceptor';

/**
 * HTTP Interceptor that will interpret authentication related HTTP calls
 */
@Injectable()
export class AuthInterceptor extends Interceptor {
	handleError(err: any): void {
		const { status, type, message, url } = this.parseError(err);
		if (status === 403) {
			this.router.navigate(['/access'], { state: { status, type, message, url } });
			this.bypassRemainingInterceptors(err);
		}
	}
}
