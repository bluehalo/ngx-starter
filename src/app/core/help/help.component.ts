import { NgFor } from '@angular/common';
import { Component } from '@angular/core';
import {
	ActivatedRoute,
	Event,
	NavigationEnd,
	Router,
	RouterLink,
	RouterLinkActive,
	RouterOutlet
} from '@angular/router';

import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { filter } from 'rxjs/operators';

import { BreadcrumbComponent } from '../../common/breadcrumb/breadcrumb.component';
import { Breadcrumb, BreadcrumbService } from '../../common/breadcrumb/breadcrumb.service';
import { getHelpTopics } from './help-topic.component';

@UntilDestroy()
@Component({
	templateUrl: 'help.component.html',
	styleUrls: ['help.component.scss'],
	standalone: true,
	imports: [BreadcrumbComponent, NgFor, RouterLinkActive, RouterLink, RouterOutlet]
})
export class HelpComponent {
	helpTopics = getHelpTopics();

	homeBreadcrumb: Breadcrumb = { label: 'Help', url: '/help' };

	title = '';

	constructor(
		private route: ActivatedRoute,
		private router: Router
	) {
		router.events
			.pipe(
				filter((event: Event) => event instanceof NavigationEnd),
				untilDestroyed(this)
			)
			.subscribe(() => (this.title = BreadcrumbService.getBreadcrumbLabel(route.snapshot)));
	}

	protected readonly top = top;
}
