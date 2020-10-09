import { AuthInterceptor } from './auth.interceptor';

export class EuaAuthInterceptor extends AuthInterceptor {
	handleError(err: any): void {
		const { status, type } = this.parseError(err);
		if (status === 403 && type === 'eua') {
			this.router.navigate(['/eua']);
			this.bypassRemainingInterceptors(err);
		}
	}
}
