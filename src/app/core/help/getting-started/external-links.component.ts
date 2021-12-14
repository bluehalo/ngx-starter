import { Component, Input } from '@angular/core';

import { UntilDestroy } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
	selector: 'external-links',
	templateUrl: 'external-links.component.html'
})
export class ExternalLinksComponent {
	@Input()
	links: any[] = [];

	handleLinkClick(evt: any) {
		evt.stopPropagation();
	}
}
