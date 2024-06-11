import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

import { HasRoleDirective } from '../auth';
import { ErrorState } from './error-state.model';

@Component({
	standalone: true,
	imports: [HasRoleDirective],
	template: `
		<div class="p-5 bg-body-tertiary rounded-3">
			<h1 class="text-body-emphasis">{{ state.status }} {{ state.statusText }}</h1>
			<p class="load">{{ state.url }}</p>
			<p class="load">{{ state.message }}</p>
			<p class="load" *hasRole="'admin'">{{ state.stack }}</p>
		</div>
	`
})
export class ErrorComponent {
	readonly #router = inject(Router);

	state: ErrorState = {
		status: 500,
		statusText: '',
		message: 'Unknown error occurred.',
		url: '/'
	};

	constructor() {
		const s = this.#router.getCurrentNavigation()?.extras?.state;
		if (s) {
			this.state = s as ErrorState;
		}
	}
}
