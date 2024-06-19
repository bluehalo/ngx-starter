import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { AbstractEntityService, ServiceMethod } from '../../common';
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

	constructor() {
		super({
			[ServiceMethod.create]: 'api/feedback',
			[ServiceMethod.search]: 'api/admin/feedback'
		});
	}

	mapToType(model: unknown): Feedback {
		return new Feedback(model);
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
		const f = new Feedback({
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
