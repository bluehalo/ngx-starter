import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import { Observable } from 'rxjs';

import { Example } from './example.model';
import { ExampleService } from './example.service';

@Injectable()
export class ExampleRestService extends ExampleService {
	private http = inject(HttpClient);

	/*
	 * API Methods
	 */

	public getExamples(): Observable<Example[]> {
		return this.http.get<Example[]>(`api/example`);
	}
}
