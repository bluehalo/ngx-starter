import { Injectable } from '@angular/core';

import { Interceptor } from './interceptor';

/**
 * HTTP Interceptor that will interpret EUA related HTTP calls
 */
@Injectable()
export class EuaAuthInterceptor extends Interceptor {
	handleError(err: any): void {
		const { status, type } = this.parseError(err);
		if (status === 403 && type === 'eua') {
			this.router.navigate(['/eua']);
			this.bypassRemainingInterceptors(err);
		}
	}
}
