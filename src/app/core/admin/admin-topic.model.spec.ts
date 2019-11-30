import { AdminTopics } from './admin-topic.model';

describe('AdminTopics', () => {

	describe('registerTopic', () => {

		const specFirst = { id: '1', ordinal: 1, title: 'Test', path: 'test' };
		const specUpdate = { id: '1', ordinal: 5, title: 'Update', path: 'new-test' };
		const specSecond = { id: '2', ordinal: 0, title: 'Second', path: 'second' };
		const specThird = { id: '3', ordinal: 0, title: 'Third', path: 'third' };
		const specNoOrdinal = { id: 'none', title: 'None', path: 'none' };
		const specOrdinalOne = { id: 'none', ordinal: 1, title: 'None', path: 'none'};

		let existingTopics;

		beforeAll(() => {
			existingTopics = AdminTopics.getTopics();
			AdminTopics.clearTopics();
		});

		afterAll(() => {
			existingTopics.forEach((topic) => {
				AdminTopics.registerTopic(topic);
			});
		});

		afterEach(() => {
			AdminTopics.clearTopics();
		});

		it('should start with no topics', () => {
			const topics = AdminTopics.getTopics();
			expect(topics).toEqual([]);
		});

		it('should be able to register topics', () => {
			AdminTopics.registerTopic(specFirst);
			expect(AdminTopics.getTopics()).toEqual([ specFirst ]);

			// Can re-register topics with the same ID
			AdminTopics.registerTopic(specUpdate);
			expect(AdminTopics.getTopics()).toEqual([ specUpdate ]);

			// Can register new topics
			AdminTopics.registerTopic(specSecond);
			expect(AdminTopics.getTopics()).toEqual([ specSecond, specUpdate ]);

			// Can register topics with the same ordinals to sort by title
			AdminTopics.registerTopic(specThird);
			expect(AdminTopics.getTopics()).toEqual([ specSecond, specThird, specUpdate ]);

		});

		it('can register without an ordinal to use default of 1', () => {
			AdminTopics.registerTopic(specNoOrdinal);
			expect(AdminTopics.getTopics()).toEqual([ specOrdinalOne ]);
		});

		it('can clear topics', () => {
			AdminTopics.registerTopic(specFirst);
			AdminTopics.registerTopic(specSecond);
			AdminTopics.registerTopic(specThird);
			expect(AdminTopics.getTopics()).toEqual([ specSecond, specThird, specFirst ]);

			AdminTopics.clearTopics();
			expect(AdminTopics.getTopics()).toEqual([]);
		});
	});

});
