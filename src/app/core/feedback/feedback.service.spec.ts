import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { getTestBed, TestBed } from '@angular/core/testing';

import { Feedback, FeedbackStatusOption } from './feedback.model';
import { FeedbackService } from './feedback.service';

describe('FeedbackService', () => {
	let injector: TestBed;
	let service: FeedbackService;
	let httpMock: HttpTestingController;

	beforeEach(async () => {
		TestBed.configureTestingModule({
			imports: [HttpClientTestingModule],
			providers: [FeedbackService]
		});

		injector = getTestBed();
		service = injector.inject(FeedbackService);
		httpMock = injector.inject(HttpTestingController);
	});

	afterEach(() => {
		// Ensure there are no outstanding requests
		httpMock.verify();
	});

	it('should exist', () => {
		expect(service).toBeDefined();
	});

	describe('feedback formatting', () => {
		it('should repeat back out normal feedback text without any options', () => {
			const feedback = new Feedback();
			feedback.body = 'hello there';
			expect(service.getFormattedBody(feedback)).toEqual(feedback.body);
		});
		it('should include subtype on a newline, and include otherText if subtype is other', () => {
			const feedback = new Feedback();
			feedback.body = 'hello there';
			feedback.subType = 'words';
			expect(service.getFormattedBody(feedback)).toEqual('words\nhello there');
			feedback.subType = 'Other';
			feedback.otherText = 'testing';
			expect(service.getFormattedBody(feedback)).toEqual('Other - testing\nhello there');
		});

		it('should prefix a message with a classification prefix, if applicable', () => {
			const feedback = new Feedback();
			feedback.body = 'hello there';
			feedback.classification = { prefix: 'K', level: 'K' };
			expect(service.getFormattedBody(feedback)).toEqual('K hello there');
		});

		it('should include classification prefix on every line', () => {
			const feedback = new Feedback();
			feedback.body = 'hello there';
			feedback.subType = 'Other';
			feedback.otherText = 'yes';
			feedback.classification = { prefix: 'K', level: 'OK' };
			expect(service.getFormattedBody(feedback)).toEqual('K Other - yes\n' + 'K hello there');
		});
	});

	describe('#updateFeedbackAssingee', () => {
		it('should call once and return an Observable<Feedback>', () => {
			const feedbackId = 'test';
			const assignee = 'testuser';
			const expected = new Feedback();

			service.updateFeedbackAssignee(feedbackId, assignee).subscribe({
				next: (actual) => {
					expect(actual).toBe(expected);
				},
				error: fail
			}); // should not error

			const req = httpMock.expectOne(`api/admin/feedback/${feedbackId}/assignee`);
			expect(req.request.method).toBe('PATCH');
			req.flush(expected);
		});
	});

	describe('#updateFeedbackStatus', () => {
		it('should call once and return an Observable<Feedback>', () => {
			const feedbackId = 'test';
			const status = FeedbackStatusOption.CLOSED;
			const expected = new Feedback();

			service.updateFeedbackStatus(feedbackId, status).subscribe({
				next: (actual) => {
					expect(actual).toBe(expected);
				},
				error: fail
			}); // should not error

			const req = httpMock.expectOne(`api/admin/feedback/${feedbackId}/status`);
			expect(req.request.method).toBe('PATCH');
			req.flush(expected);
		});
	});
});
