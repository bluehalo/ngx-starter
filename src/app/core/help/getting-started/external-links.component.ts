import { Component, OnInit } from '@angular/core';

import { untilDestroyed, UntilDestroy } from '@ngneat/until-destroy';
import { first } from 'rxjs/operators';
import { ConfigService } from '../../config.service';

@UntilDestroy()
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
			.pipe(first(), untilDestroyed(this))
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
