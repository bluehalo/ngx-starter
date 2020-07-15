import { Component } from '@angular/core';

import { untilDestroyed, UntilDestroy } from '@ngneat/until-destroy';
import { first } from 'rxjs/operators';
import { Config } from '../config.model';
import { ConfigService } from '../config.service';

@UntilDestroy()
@Component({
	selector: 'site-container',
	templateUrl: 'site-container.component.html',
	styleUrls: ['site-container.component.scss']
})
export class SiteContainerComponent {
	bannerHtml = undefined;
	copyrightHtml = undefined;
	showFeedbackFlyout = false;

	constructor(private configService: ConfigService) {
		configService
			.getConfig()
			.pipe(first(), untilDestroyed(this))
			.subscribe((config: Config) => {
				this.bannerHtml = config?.banner?.html ?? undefined;
				this.copyrightHtml = config?.copyright?.html ?? undefined;
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
			appContent.focus();
			window.scrollTo(0, 0);
		}
	}
}
