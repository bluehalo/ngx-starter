import isNil from 'lodash/isNil';
import values from 'lodash/values';
import sortBy from 'lodash/sortBy';

export class AdminTopic {
	id: string;
	ordinal?: number;
	path: string;
	title: string;
}

export class AdminTopics {
	private static topics: { [s: string]: AdminTopic } = {};

	static clearTopics() {
		this.topics = {};
	}

	static registerTopic(topic: AdminTopic) {
		if (isNil(topic.ordinal)) {
			topic.ordinal = 1;
		}
		this.topics[topic.id] = topic;
	}

	static getTopics(): AdminTopic[] {
		const topics = values(this.topics);
		return sortBy(topics, ['ordinal', 'title', 'path']);
	}
}
