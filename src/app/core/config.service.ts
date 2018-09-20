import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

import { Config } from './config.model';

@Injectable()
export class ConfigService {

	config: Config = null;

	constructor(private http: HttpClient) {}

	public getConfig(): Observable<Config> {
		if (null == this.config) {
			return this.http.get('api/config').pipe(
				tap((config: any) => this.config = config)
			);
		}
		else {
			return of(this.config);
		}
	}

}
