import { NgIf } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';

import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { first } from 'rxjs/operators';

import { ConfigService } from '../../config.service';
import { ExternalLinksComponent } from './external-links.component';

@UntilDestroy()
@Component({
	templateUrl: 'getting-started-help.component.html',
	standalone: true,
	imports: [NgIf, ExternalLinksComponent]
})
export class GettingStartedHelpComponent implements OnInit {
	@Output() readonly backEvent = new EventEmitter();

	externalLinks: any[] = [];

	appName = 'Application';

	constructor(private configService: ConfigService) {}

	ngOnInit() {
		this.configService
			.getConfig()
			.pipe(first(), untilDestroyed(this))
			.subscribe((config: any) => {
				if (config?.welcomeLinks?.enabled && Array.isArray(config?.welcomeLinks?.links)) {
					this.externalLinks = config.welcomeLinks.links;
				}

				this.appName = config?.app?.title;
			});
	}

	back() {
		this.backEvent.emit({});
	}
}
