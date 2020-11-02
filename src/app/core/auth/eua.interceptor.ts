import { Injectable } from '@angular/core';

import { AbstractHttpInterceptor } from './abstract.interceptor';

/**
 * HTTP Interceptor that will interpret EUA related HTTP calls
 */
@Injectable()
export class EuaInterceptor extends AbstractHttpInterceptor {
	handleError(err: any): void {
		const { status, type } = this.parseError(err);
		if (status === 403 && type === 'eua') {
			this.router.navigate(['/eua']);
		}
	}
}
