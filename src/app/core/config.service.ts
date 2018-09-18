import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { of } from 'rxjs';
import { tap } from 'rxjs/operators';


@Injectable()
export class ConfigService {

	config: any = null;

	constructor(private http: HttpClient) {}

	public getConfig() {
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
