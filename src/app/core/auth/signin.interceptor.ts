import { AuthInterceptor } from './auth.interceptor';

export class SigninAuthInterceptor extends AuthInterceptor {
	handleError(err: any): void {
		const { status, url } = this.parseError(err);
		if (status === 401 && !url.endsWith('auth/signin')) {
			this.router.navigate(['/signin']);
			this.bypassRemainingInterceptors(err);
		}
	}
}
