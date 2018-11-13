import values from 'lodash/values';
import { StringUtils } from '../../common/string-utils.service';

export class AdminTopic {
	id: string;
	title: string;
}

export class AdminTopics {
	private static topicOrder: any = {};

	static registerTopic(key: string, ordinal?: number) {
		this.topicOrder[key] = { key: key, ordinal: ordinal };
	}

	static getTopicList(): string[] {
		return values(this.topicOrder).sort((a, b) => a.ordinal - b.ordinal).map((v) => v.key);
	}

	static getTopics(): AdminTopic[] {
		return AdminTopics.getTopicList().map((topic: string) => ({ id: topic, title: AdminTopics.getTopicTitle(topic, true) }));
	}

	static getTopicTitle(title: string, short: boolean = false): string {
		return StringUtils.hyphenToHuman(title);
	}
}
