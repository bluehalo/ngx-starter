import { Component, Input } from '@angular/core';

import { Config } from '../../config.model';

@Component({
	selector: 'external-links',
	templateUrl: 'external-links.component.html',
	standalone: true,
	imports: []
})
export class ExternalLinksComponent {
	@Input()
	links: Config['help']['welcomeLinks'] = [];

	handleLinkClick(evt: any) {
		evt.stopPropagation();
	}
}
