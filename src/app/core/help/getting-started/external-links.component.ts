import { Component, Input } from '@angular/core';

@Component({
	selector: 'external-links',
	templateUrl: 'external-links.component.html',
	standalone: true,
	imports: []
})
export class ExternalLinksComponent {
	@Input()
	links: any[] = [];

	handleLinkClick(evt: any) {
		evt.stopPropagation();
	}
}
