import { Component } from '@angular/core';
import { ActivatedRoute, Event, NavigationEnd, Router } from '@angular/router';

import { filter } from 'rxjs/operators';

import { BreadcrumbService, Breadcrumb } from '../../common/breadcrumb/breadcrumb.service';
import { HelpTopics } from './help-topic.component';

export class HelpTopic {
	id: string;
	title: string;
}

@Component({
	templateUrl: 'help.component.html',
	styleUrls: ['help.component.scss']
})
export class HelpComponent {
	helpTopics: HelpTopic[] = [];

	homeBreadcrumb: Breadcrumb = { label: 'Help', url: '/help' };

	title: string;

	constructor(private route: ActivatedRoute, private router: Router) {
		this.helpTopics = HelpTopics.getTopicList().map((topic: string) => ({
			id: topic,
			title: HelpTopics.getTopicTitle(topic, true)
		}));

		router.events
			.pipe(filter((event: Event) => event instanceof NavigationEnd))
			.subscribe(() => (this.title = BreadcrumbService.getBreadcrumbLabel(route.snapshot)));
	}
}
