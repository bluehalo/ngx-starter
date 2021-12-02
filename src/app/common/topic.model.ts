import sortBy from 'lodash/sortBy';

export interface Topic {
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
		if (topic.ordinal == null) {
			topic.ordinal = 1;
		}
		this.topics[topic.id] = topic;
	}

	getTopics(): T[] {
		const topics = Object.values(this.topics);
		return sortBy(topics, ['ordinal', 'title', 'path']);
	}
}
