import { Component, input } from '@angular/core';

import { Config } from '../../config.model';

@Component({
	selector: 'external-links',
	templateUrl: './external-links.component.html',
	standalone: true,
	imports: []
})
export class ExternalLinksComponent {
	readonly links = input<Config['help']['welcomeLinks']>([]);

	handleLinkClick(evt: Event) {
		evt.stopPropagation();
	}
}
