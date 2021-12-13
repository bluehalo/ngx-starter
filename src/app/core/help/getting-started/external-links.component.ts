import { Component, Input, OnInit } from '@angular/core';

import { UntilDestroy } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
	selector: 'external-links',
	templateUrl: 'external-links.component.html'
})
export class ExternalLinksComponent implements OnInit {
	@Input()
	links: any[] = [];

	constructor() {}

	ngOnInit() {}

	handleLinkClick(evt: any) {
		evt.stopPropagation();
	}
}
