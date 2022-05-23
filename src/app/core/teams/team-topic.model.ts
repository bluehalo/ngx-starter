import { Topic, TopicRegistry } from '../../common/topic.model';

export type TeamTopic = Topic;

const teamTopics = new TopicRegistry<TeamTopic>();
export { teamTopics as TeamTopics };
