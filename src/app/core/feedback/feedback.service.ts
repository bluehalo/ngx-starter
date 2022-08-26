import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { AbstractEntityService, ServiceMethod } from '../../common/abstract-entity.service';
import { SystemAlertService } from '../../common/system-alert/system-alert.service';
import { Feedback, FeedbackStatusOption } from './feedback.model';

@Injectable({
	providedIn: 'root'
})
export class FeedbackService extends AbstractEntityService<Feedback> {
	static feedbackTypes: any[] = [
		{ name: 'general feedback', prompt: 'Ask a question or make a comment' },
		{ name: 'feature request', prompt: 'Suggest a new feature' },
		{
			name: 'bug report',
			prompt: 'Report a bug/error',
			subType: {
				label: "What's the bug/error type?",
				types: ['Content or data', 'Styling', 'Technical', 'Other', 'Unsure']
			}
		}
	];

	constructor(http: HttpClient, alertService: SystemAlertService) {
		super(
			{
				[ServiceMethod.create]: 'api/feedback',
				[ServiceMethod.search]: 'api/admin/feedback'
			},
			http,
			alertService
		);
	}

	mapToType(model: any): Feedback {
		return new Feedback().setFromModel(model);
	}

	getFormattedBody(feedback: Feedback): string {
		let text = '';
		const prefix = `${feedback.classification ? feedback.classification.prefix + ' ' : ''}`;
		if (feedback.subType !== undefined) {
			text += `${prefix}${feedback.subType}`;
			if (feedback.subType === 'Other') {
				text += ` - ${feedback.otherText}`;
			}
			text += '\n';
		}
		text += `${prefix}${feedback.body}`;
		return text;
	}

	override create(feedback: Feedback): Observable<Feedback | null> {
		const f = new Feedback().setFromModel({
			body: this.getFormattedBody(feedback),
			type: feedback.type,
			classification: feedback.classification?.level ?? '',
			url: feedback.url
		});
		return super.create(f);
	}

	updateFeedbackAssignee(feedbackId: string, assignee: string | null): Observable<Feedback> {
		return this.http.patch<Feedback>(`api/admin/feedback/${feedbackId}/assignee`, {
			assignee
		});
	}

	updateFeedbackStatus(feedbackId: string, status: FeedbackStatusOption): Observable<Feedback> {
		return this.http.patch<Feedback>(`api/admin/feedback/${feedbackId}/status`, { status });
	}
}
