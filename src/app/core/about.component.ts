import { ChangeDetectionStrategy, Component, computed, effect, inject } from '@angular/core';

import { APP_CONFIG } from './tokens';

@Component({
	template: `
		<div class="container">
			<div class="row">
				<div class="col-md-8 offset-2 jumbotron" style="margin-top: 4rem;">
					<h1>{{ appTitle() }}</h1>
					<p>v{{ version() }}</p>
				</div>
			</div>
		</div>
	`,
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class AboutComponent {
	private config = inject(APP_CONFIG);

	appTitle = computed(() => this.config()?.app?.title);
	version = computed(() => this.config()?.version);

	constructor() {
		effect(() => {
			console.log(this.config()?.app);
		});
	}
}
