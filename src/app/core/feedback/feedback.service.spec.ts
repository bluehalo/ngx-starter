import { Feedback } from './feedback.model';
import { FeedbackService } from './feedback.service';

describe('FeedbackService', () => {
	it('should exist', () => {
		expect(new FeedbackService({} as any, {} as any)).toBeDefined();
	});

	describe('feedback formatting', () => {
		it('should repeat back out normal feedback text without any options', () => {
			const service = new FeedbackService({} as any, {} as any);
			const feedback = new Feedback();
			feedback.text = 'hello there';
			expect(service.getFormattedText(feedback)).toEqual(feedback.text);
		});
		it('should include subtype on a newline, and include otherText if subtype is other', () => {
			const service = new FeedbackService({} as any, {} as any);
			const feedback = new Feedback();
			feedback.text = 'hello there';
			feedback.subType = 'words';
			expect(service.getFormattedText(feedback)).toEqual('words\nhello there');
			feedback.subType = 'Other';
			feedback.otherText = 'testing';
			expect(service.getFormattedText(feedback)).toEqual('Other - testing\nhello there');
		});

		it('should prefix a message with a classification prefix, if applicable', () => {
			const service = new FeedbackService({} as any, {} as any);
			const feedback = new Feedback();
			feedback.text = 'hello there';
			feedback.classification = { prefix: 'K', level: 'K' };
			expect(service.getFormattedText(feedback)).toEqual('K hello there');
		});

		it('should include classification prefix on every line', () => {
			const service = new FeedbackService({} as any, {} as any);
			const feedback = new Feedback();
			feedback.text = 'hello there';
			feedback.subType = 'Other';
			feedback.otherText = 'yes';
			feedback.classification = { prefix: 'K', level: 'OK' };
			expect(service.getFormattedText(feedback)).toEqual('K Other - yes\n' + 'K hello there');
		});
	});
});
