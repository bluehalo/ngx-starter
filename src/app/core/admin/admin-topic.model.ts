import values from 'lodash/values';

export class AdminTopic {
	id: string;
	ordinal?: number = 1;
	path: string;
	title: string;
}

export class AdminTopics {
	private static topics: { [s: string]: AdminTopic } = {};

	static registerTopic(topic: AdminTopic) {
		this.topics[topic.id] = topic;
	}

	static getTopics(): AdminTopic[] {
		return values(this.topics).sort((a, b) => a.ordinal - b.ordinal);
	}

}
