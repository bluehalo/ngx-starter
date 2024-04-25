import { CdkScrollable } from '@angular/cdk/overlay';
import { Component, computed, inject } from '@angular/core';

import { IsAuthenticatedDirective } from '../auth/directives/is-authenticated.directive';
import { APP_CONFIG } from '../config.service';
import { FeedbackFlyoutComponent } from '../feedback/feedback-flyout/feedback-flyout.component';
import { SiteNavbarComponent } from '../site-navbar/site-navbar.component';

@Component({
	selector: 'site-container',
	templateUrl: 'site-container.component.html',
	styleUrls: ['site-container.component.scss'],
	standalone: true,
	imports: [SiteNavbarComponent, IsAuthenticatedDirective, FeedbackFlyoutComponent, CdkScrollable]
})
export class SiteContainerComponent {
	private config = inject(APP_CONFIG);

	bannerHtml = computed(() => this.config()?.banner?.html);
	copyrightHtml = computed(() => this.config()?.copyright?.html);
	showFeedbackFlyout = computed(() => this.config()?.feedback?.showFlyout ?? false);

	skipToMainContent(e: any) {
		e.preventDefault();

		// querySelector gets the first matched element
		const skipTo = document.querySelector('.skip-to') as HTMLElement;
		const appContent = document.getElementById('app-content');

		if (skipTo) {
			skipTo.focus();
		} else {
			// fall back to main content area if no .skip-to elements are found
			appContent?.focus();
			window.scrollTo(0, 0);
		}
	}
}
