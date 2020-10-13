import { Injectable } from '@angular/core';

import { AuthInterceptor } from './auth.interceptor';

@Injectable()
export class EuaAuthInterceptor extends AuthInterceptor {
	handleError(err: any): void {
		const { status, type } = this.parseError(err);
		if (status === 403 && type === 'eua') {
			this.router.navigate(['/eua']);
			this.bypassRemainingInterceptors(err);
		}
	}
}
