import { Component, OnInit } from '@angular/core';

import { first } from 'rxjs/operators';

import { ConfigService } from '../../config.service';

@Component({
	selector: 'external-links',
	templateUrl: 'external-links.component.html'
})
export class ExternalLinksComponent implements OnInit {
	links: any;

	private config: any;

	private externalLinksEnabled: boolean;

	constructor(private configService: ConfigService) {}

	ngOnInit() {
		this.configService
			.getConfig()
			.pipe(first())
			.subscribe((config: any) => {
				this.config = config;

				this.externalLinksEnabled = config?.welcomeLinks?.enabled ?? false;
				this.links = config.welcomeLinks.links;
			});
	}

	handleLinkClick(evt: any) {
		evt.stopPropagation();
	}
}
