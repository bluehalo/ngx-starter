import { HttpBackend, HttpEvent, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable, InjectionToken, Signal, inject } from '@angular/core';

import { AsyncSubject, Observable } from 'rxjs';

import { Config } from './config.model';

export const APP_CONFIG = new InjectionToken<Signal<Config | null | undefined>>('APP_CONFIG');

@Injectable({
	providedIn: 'root'
})
export class ConfigService {
	private configSubject$ = new AsyncSubject<Config | null>();

	private http = inject(HttpBackend);

	constructor() {
		this.reloadConfig();
	}

	/**
	 * Get the shared config observable
	 */
	public getConfig(): Observable<Config | null> {
		return this.configSubject$;
	}

	/**
	 * Refresh the latest config and fire it to the subject. This should not need
	 * to be invoked frequently because the config rarely changes.
	 *
	 * We are using HttpBackend to avoid the interceptors since this call is invoked
	 * as part of the app initialization process.
	 */
	public reloadConfig() {
		const request = new HttpRequest<Config>('GET', 'api/config', {});

		this.http.handle(request).subscribe({
			next: (httpEvent: HttpEvent<Config>) => {
				if (httpEvent instanceof HttpResponse) {
					let newConfig = null;
					const response: HttpResponse<Config> = httpEvent;

					if (response.status >= 200 && response.status < 300) {
						newConfig = response.body;
					}

					this.configSubject$.next(newConfig);
					this.configSubject$.complete();
				}
			},
			error: () => {
				this.configSubject$.next(null);
				this.configSubject$.complete();
			}
		});
	}
}
