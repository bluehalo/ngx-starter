import { Component, OnInit } from '@angular/core';

import { Config } from './config.model';
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
	styles: ['']
})
export class AboutComponent implements OnInit {
	appTitle: string = undefined;
	version: string = undefined;

	constructor(private configService: ConfigService) {}

	ngOnInit() {
		this.configService.getConfig().subscribe((config: Config) => {
			this.appTitle = config?.app?.title ?? '';
			this.version = config.version;
		});
	}
}
