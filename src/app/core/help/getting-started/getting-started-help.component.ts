import { Component, computed, inject } from '@angular/core';

import { APP_CONFIG } from '../../tokens';
import { ExternalLinksComponent } from './external-links.component';

@Component({
	templateUrl: 'getting-started-help.component.html',
	standalone: true,
	imports: [ExternalLinksComponent]
})
export class GettingStartedHelpComponent {
	private config = inject(APP_CONFIG);

	appName = computed(() => this.config()?.app?.title ?? 'Application');
	externalLinks = computed(() => this.config()?.help.welcomeLinks ?? []);
}
