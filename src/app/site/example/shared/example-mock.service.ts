import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';

import { Example } from './example.model';
import { ExampleService } from './example.service';

@Injectable()
export class ExampleMockService extends ExampleService {
	constructor(private http: HttpClient) {
		super();
	}

	/*
	 * API Methods
	 */

	public getExamples(): Observable<Example[]> {
		return of([
			{
				foo: 'Foo 1',
				bar: 10,
				baz: new Date()
			},
			{
				foo: 'Foo 2',
				bar: 8,
				baz: new Date()
			}
		]);
	}
}
