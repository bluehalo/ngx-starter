import { AdminTopics } from './admin-topic.model';

describe('AdminTopics', () => {
	describe('registerTopic', () => {
		const specFirst = { id: '1', ordinal: 1, title: 'Test', path: 'test' };
		const specUpdate = { id: '1', ordinal: 5, title: 'Update', path: 'new-test' };
		const specSecond = { id: '2', ordinal: 0, title: 'Second', path: 'second' };
		const specThird = { id: '3', ordinal: 0, title: 'Third', path: 'third' };
		const specNoOrdinal = { id: 'none', title: 'None', path: 'none' };

		const existingTopics = AdminTopics.getTopics();

		beforeEach(() => {
			AdminTopics.clearTopics();
		});

		afterAll(() => {
			existingTopics.forEach(topic => {
				AdminTopics.registerTopic(topic);
			});
		});

		it('should start with no topics', () => {
			const topics = AdminTopics.getTopics();
			expect(topics).toEqual([]);
		});
		it('can register a topic', () => {
			AdminTopics.registerTopic(specFirst);
			const topics = AdminTopics.getTopics();
			expect(topics).toEqual([specFirst]);
		});
		it('can re-register the same topic id', () => {
			AdminTopics.registerTopic(specFirst);
			AdminTopics.registerTopic(specUpdate);
			const topics = AdminTopics.getTopics();
			expect(topics).toEqual([specUpdate]);
		});

		it('can register a new topic', () => {
			AdminTopics.registerTopic(specFirst);
			AdminTopics.registerTopic(specSecond);
			const topics = AdminTopics.getTopics();
			expect(topics).toEqual([specSecond, specFirst]);
		});

		it('can register a new topic with the same ordinal and sort by title', () => {
			AdminTopics.registerTopic(specUpdate);
			AdminTopics.registerTopic(specSecond);
			AdminTopics.registerTopic(specThird);
			const topics = AdminTopics.getTopics();
			expect(topics).toEqual([specSecond, specThird, specUpdate]);
		});

		it('can register without an ordinal to use default of 1', () => {
			AdminTopics.registerTopic(specUpdate);
			AdminTopics.registerTopic(specSecond);
			AdminTopics.registerTopic(specThird);
			AdminTopics.registerTopic(specNoOrdinal);
			const topics = AdminTopics.getTopics();
			expect(topics).toEqual([specSecond, specThird, specNoOrdinal, specUpdate]);
		});

		it('can clear topics', () => {
			AdminTopics.clearTopics();
			expect(AdminTopics.getTopics()).toEqual([]);
		});
	});
});
