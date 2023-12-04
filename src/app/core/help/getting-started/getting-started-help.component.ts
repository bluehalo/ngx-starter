import { NgIf } from '@angular/common';
import { Component, DestroyRef, EventEmitter, OnInit, Output, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { first } from 'rxjs/operators';

import { ConfigService } from '../../config.service';
import { ExternalLinksComponent } from './external-links.component';

@Component({
	templateUrl: 'getting-started-help.component.html',
	standalone: true,
	imports: [NgIf, ExternalLinksComponent]
})
export class GettingStartedHelpComponent implements OnInit {
	@Output() readonly backEvent = new EventEmitter();

	externalLinks: any[] = [];

	appName = 'Application';

	private destroyRef = inject(DestroyRef);
	private configService = inject(ConfigService);

	ngOnInit() {
		this.configService
			.getConfig()
			.pipe(first(), takeUntilDestroyed(this.destroyRef))
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
