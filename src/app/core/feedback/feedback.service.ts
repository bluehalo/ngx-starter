import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { PagingResults, NULL_PAGING_RESULTS, PagingOptions } from '../../common/paging.module';
import { SystemAlertService } from '../../common/system-alert/system-alert.service';
import { Feedback } from './feedback.model';

@Injectable()
export class FeedbackService {

	static feedbackTypes: any[] = [
		{ name: 'General Feedback', prompt: 'Ask a question or make a comment' },
		{ name: 'Feature Request', prompt: 'Suggest a new feature' },
		{ name: 'Bug Report', prompt: 'Report a bug/error',
			subType: {
				label: 'What\'s the bug/error type?',
				types: ['Content or data', 'Styling', 'Technical', 'Other', 'Unsure']
			}
		}
	];

	headers: any = { 'Content-Type': 'application/json'	};

	constructor(
		private http: HttpClient,
		private alertService: SystemAlertService
	) {}

	getFormattedText(feedback: Feedback): string {
		let text: string = '';
		if (feedback.subType !== undefined) {
			text += `${feedback.classification.prefix} ${feedback.subType}`;
			if (feedback.subType === 'Other') {
				text += ` - ${feedback.otherText}`;
			}
			text += '\n';
		}
		text += `${feedback.classification.prefix} ${feedback.text}`;
		return text;
	}

	submit(feedback: Feedback): Observable<any> {
		return this.http.post(
			'api/feedback',
			JSON.stringify({
				body: this.getFormattedText(feedback),
				type: feedback.type.toLowerCase(),
				classification: feedback.classification.level,
				url: feedback.currentRoute
			}),
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
