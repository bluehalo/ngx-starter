import { Topic, TopicRegistry } from '../../common/topic.model';

export interface NavbarTopic extends Topic {
	iconClass: string;
	hasSomeRoles: string[];
}

const navbarTopics = new TopicRegistry<NavbarTopic>();
export { navbarTopics as NavbarTopics };
