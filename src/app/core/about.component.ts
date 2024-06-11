import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';

import { APP_CONFIG } from './tokens';

@Component({
	template: `
		<div class="p-5 text-center bg-body-tertiary rounded-3">
			<h1 class="text-body-emphasis">{{ appTitle() }}</h1>
			<p class="load">v{{ version() }}</p>
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
