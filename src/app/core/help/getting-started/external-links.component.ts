import { NgFor } from '@angular/common';
import { Component, Input } from '@angular/core';

import { UntilDestroy } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
	selector: 'external-links',
	templateUrl: 'external-links.component.html',
	standalone: true,
	imports: [NgFor]
})
export class ExternalLinksComponent {
	@Input()
	links: any[] = [];

	handleLinkClick(evt: any) {
		evt.stopPropagation();
	}
}
