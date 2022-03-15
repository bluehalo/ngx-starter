import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';

import { ConfigService } from '../config.service';
import { MasqueradeService } from './masquerade.service';

/**
 * HTTP Interceptor that will add Masquerade related
 */
@Injectable()
export class MasqueradeInterceptor implements HttpInterceptor {
	private masqueradeHeader = 'x-masquerade-user-dn';

	constructor(
		private router: Router,
		private masqueradeService: MasqueradeService,
		private configService: ConfigService
	) {
		this.configService
			.getConfig()
			.pipe(first())
			.subscribe((config) => {
				if (config?.masqueradeHeader) {
					this.masqueradeHeader = config.masqueradeHeader;
				}
			});
	}

	intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		const masqDn = this.masqueradeService.getMasqueradeDn();
		if (masqDn) {
			req = req.clone({
				setHeaders: {
					[this.masqueradeHeader]: masqDn
				}
			});
		}
		return next.handle(req);
	}
}
