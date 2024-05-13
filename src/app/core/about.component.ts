import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';

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
	readonly #config = inject(APP_CONFIG);

	readonly appTitle = computed(() => this.#config()?.app?.title);
	readonly version = computed(() => this.#config()?.version);
}
