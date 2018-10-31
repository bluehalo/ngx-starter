import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/index';

import { Example } from './example.model';
import { ExampleService } from './example.service';

@Injectable()
export class ExampleRestService extends ExampleService {

	constructor(private http: HttpClient) {
		super();
	}

	/*
	 * API Methods
	 */

	public getExamples(): Observable<Example[]> {
		return this.http.get<Example []>(`api/example`);
	}

}
