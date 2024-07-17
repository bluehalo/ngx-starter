import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
	template: `
		<div class="p-5 text-center bg-body-tertiary rounded-3">
			<h1 class="text-body-emphasis">{{ status }}</h1>
			<p class="load">{{ message }}</p>
			<p>
				Once your account is updated,
				<a class="btn btn-link p-0" href="/">go back home</a> and try again.
			</p>
		</div>
	`,
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccessComponent {
	readonly #router = inject(Router);

	status = '403';
	message = 'User is missing authorizations for access.';

	constructor() {
		const state = this.#router.getCurrentNavigation()?.extras?.state;
		if (state) {
			this.status = state['status'];
			this.message = state['message'];
		}
	}
}
