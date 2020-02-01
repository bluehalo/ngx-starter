import isNil from 'lodash/isNil';
import values from 'lodash/values';
import sortBy from 'lodash/sortBy';

export class NavbarTopic {
	id: string;
	ordinal?: number;
	path: string;
	title: string;
	iconClass: string;
	hasSomeRoles?: string[];
}

export class NavbarTopics {
	private static topics: { [s: string]: NavbarTopic } = {};

	static clearTopics() {
		this.topics = {};
	}

	static registerTopic(topic: NavbarTopic) {
		if (isNil(topic.ordinal)) {
			topic.ordinal = 1;
		}
		this.topics[topic.id] = topic;
	}

	static getTopics(): NavbarTopic[] {
		const topics = values(this.topics);
		return sortBy(topics, ['ordinal', 'title', 'path']);
	}
}
