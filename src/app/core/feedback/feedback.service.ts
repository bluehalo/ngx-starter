import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { PagingResults, NULL_PAGING_RESULTS, PagingOptions } from '../../common/paging.module';
import { SystemAlertService } from '../../common/system-alert/system-alert.service';

@Injectable()
export class FeedbackService {

	static feedbackTypes: any[] = [
		{ name: 'General Feedback', prompt: 'Please share your feedback.' },
		{ name: 'Bug Report', prompt: 'Please describe the bug. What were you doing when the bug happened?' },
		{ name: 'Feature Request', prompt: 'What feature would you like to see?' }
	];

	headers: any = { 'Content-Type': 'application/json'	};

	constructor(
		private http: HttpClient,
		private alertService: SystemAlertService
	) {}

	submit(feedback: string, type: string, url: string, classification?: any): Observable<any> {
		return this.http.post(
			'api/feedback',
			JSON.stringify({ body: feedback, type: type.toLowerCase(), url, classification }),
			{ headers: this.headers }
		);
	}

	getFeedback(paging: PagingOptions, query: any, search: string, options: any): Observable<PagingResults> {
		return this.http.post<PagingResults>(
			'api/admin/feedback',
			JSON.stringify({ s: search, q: query, options }),
			{ params: paging.toObj(), headers: this.headers }
		).pipe(
			catchError((error: HttpErrorResponse) => {
				this.alertService.addAlert(error.error.message);
				return of(NULL_PAGING_RESULTS);
			})
		);
	}
}
