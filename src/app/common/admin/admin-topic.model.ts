import { Topic, TopicRegistry } from '../topic.model';

export class AdminTopic extends Topic {}

const adminTopics = new TopicRegistry<AdminTopic>();
export { adminTopics as AdminTopics };
