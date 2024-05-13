import { Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
	ActivatedRoute,
	NavigationEnd,
	Router,
	RouterLink,
	RouterLinkActive,
	RouterOutlet
} from '@angular/router';

import { filter } from 'rxjs/operators';

import { BreadcrumbComponent } from '../../common/breadcrumb/breadcrumb.component';
import { Breadcrumb, BreadcrumbService } from '../../common/breadcrumb/breadcrumb.service';
import { injectHelpTopics } from './help-topic.component';

@Component({
	templateUrl: 'help.component.html',
	styleUrls: ['help.component.scss'],
	standalone: true,
	imports: [BreadcrumbComponent, RouterLinkActive, RouterLink, RouterOutlet]
})
export class HelpComponent {
	readonly #route = inject(ActivatedRoute);
	readonly #router = inject(Router);
	readonly helpTopics = injectHelpTopics();

	homeBreadcrumb: Breadcrumb = { label: 'Help', url: '/help' };

	title = '';

	protected readonly top = top;

	constructor() {
		this.#router.events
			.pipe(
				filter((event) => event instanceof NavigationEnd),
				takeUntilDestroyed()
			)
			.subscribe(() => {
				this.title = BreadcrumbService.getBreadcrumbLabel(this.#route.snapshot);
			});
	}
}
