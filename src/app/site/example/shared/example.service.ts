import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/index';

import { Example } from './example.model';

@Injectable()
export abstract class ExampleService {
	abstract getExamples(): Observable<Example[]>;
}
