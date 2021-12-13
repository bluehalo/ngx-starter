import { Topic, TopicRegistry } from '../topic.model';

export type AdminTopic = Topic;

const adminTopics = new TopicRegistry<AdminTopic>();
export { adminTopics as AdminTopics };
