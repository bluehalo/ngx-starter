import { NgIf } from '@angular/common';
import { Component } from '@angular/core';

import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { first } from 'rxjs/operators';

import { IsAuthenticatedDirective } from '../auth/directives/is-authenticated.directive';
import { ConfigService } from '../config.service';
import { FeedbackFlyoutComponent } from '../feedback/feedback-flyout/feedback-flyout.component';
import { SiteNavbarComponent } from '../site-navbar/site-navbar.component';

@UntilDestroy()
@Component({
	selector: 'site-container',
	templateUrl: 'site-container.component.html',
	styleUrls: ['site-container.component.scss'],
	standalone: true,
	imports: [NgIf, SiteNavbarComponent, IsAuthenticatedDirective, FeedbackFlyoutComponent]
})
export class SiteContainerComponent {
	bannerHtml?: string;
	copyrightHtml?: string;
	showFeedbackFlyout = false;

	constructor(private configService: ConfigService) {
		configService
			.getConfig()
			.pipe(first(), untilDestroyed(this))
			.subscribe((config) => {
				this.bannerHtml = config?.banner?.html;
				this.copyrightHtml = config?.copyright?.html;
				this.showFeedbackFlyout = config?.feedback?.showFlyout ?? false;
			});
	}

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
