import { Component, DestroyRef, inject } from '@angular/core';
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
import { getHelpTopics } from './help-topic.component';

@Component({
	templateUrl: 'help.component.html',
	styleUrls: ['help.component.scss'],
	standalone: true,
	imports: [BreadcrumbComponent, RouterLinkActive, RouterLink, RouterOutlet]
})
export class HelpComponent {
	helpTopics = getHelpTopics();

	homeBreadcrumb: Breadcrumb = { label: 'Help', url: '/help' };

	title = '';

	protected readonly top = top;

	private destroyRef = inject(DestroyRef);
	private route = inject(ActivatedRoute);
	private router = inject(Router);

	constructor() {
		this.router.events
			.pipe(
				filter((event) => event instanceof NavigationEnd),
				takeUntilDestroyed(this.destroyRef)
			)
			.subscribe(
				() => (this.title = BreadcrumbService.getBreadcrumbLabel(this.route.snapshot))
			);
	}
}
