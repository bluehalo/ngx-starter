import { Component, computed, inject } from '@angular/core';

import { APP_CONFIG } from '../../tokens';
import { ExternalLinksComponent } from './external-links.component';

@Component({
	templateUrl: 'getting-started-help.component.html',
	standalone: true,
	imports: [ExternalLinksComponent]
})
export class GettingStartedHelpComponent {
	readonly #config = inject(APP_CONFIG);

	readonly appName = computed(() => this.#config()?.app?.title ?? 'Application');
	readonly externalLinks = computed(() => this.#config()?.help.welcomeLinks ?? []);
}
