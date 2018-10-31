import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { AsyncSubject } from 'rxjs';

import { Config } from './config.model';

@Injectable()
export class ConfigService {

	configSubject = new AsyncSubject <Config>();

	constructor(private http: HttpClient) {
		this.reloadConfig();
	}

	/**
	 * Get the shared config observable
	 * @returns {BehaviorSubject<Config>}
	 */
	public getConfig(): AsyncSubject<Config> {
		return this.configSubject;
	}

	/**
	 * Force a call to the server to get the latest config. There really isn't
	 * a need to ever invoke this externally. Config shouldn't change.
	 */
	public reloadConfig() {
		this.http.get<Config>('api/config')
			.subscribe(
				(config) => {
					this.configSubject.next(config);
					this.configSubject.complete();
				},
				() => {
					this.configSubject.next(null);
					this.configSubject.complete();
				});
	}
}
