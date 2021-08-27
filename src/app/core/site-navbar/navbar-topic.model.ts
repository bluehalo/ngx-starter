import { Topic, TopicRegistry } from '../../common/topic.model';

export class NavbarTopic extends Topic {
	iconClass: string;
	hasSomeRoles: string[] = [];
}

const navbarTopics = new TopicRegistry<NavbarTopic>();
export { navbarTopics as NavbarTopics };
