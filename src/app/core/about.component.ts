import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { first } from 'rxjs/operators';

import { ConfigService } from './config.service';

@Component({
	template: `
		<div class="container">
			<div class="row">
				<div class="col-md-8 offset-2 jumbotron" style="margin-top: 4rem;">
					<h1>{{ appTitle }}</h1>
					<p>v{{ version }}</p>
				</div>
			</div>
		</div>
	`,
	standalone: true
})
export class AboutComponent implements OnInit {
	appTitle?: string;
	version?: string;

	private destroyRef = inject(DestroyRef);
	private configService = inject(ConfigService);

	ngOnInit() {
		this.configService
			.getConfig()
			.pipe(first(), takeUntilDestroyed(this.destroyRef))
			.subscribe((config) => {
				this.appTitle = config?.app?.title ?? '';
				this.version = config?.version ?? '';
			});
	}
}
