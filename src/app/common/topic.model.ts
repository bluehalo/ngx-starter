import isNil from 'lodash/isNil';
import sortBy from 'lodash/sortBy';
import values from 'lodash/values';

export class Topic {
	id: string;
	ordinal?: number;
	path: string;
	title: string;
}

export class TopicRegistry<T extends Topic> {
	private topics: { [s: string]: T } = {};

	clearTopics() {
		this.topics = {};
	}

	registerTopic(topic: T) {
		if (isNil(topic.ordinal)) {
			topic.ordinal = 1;
		}
		this.topics[topic.id] = topic;
	}

	getTopics(): T[] {
		const topics = values(this.topics);
		return sortBy(topics, ['ordinal', 'title', 'path']);
	}
}
