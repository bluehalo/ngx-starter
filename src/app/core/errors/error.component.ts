import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { HasRoleDirective } from '../auth/directives/has-role.directive';
import { ErrorState } from './error-state.model';

@Component({
	standalone: true,
	imports: [HasRoleDirective],
	template: `
		<div class="container">
			<div class="row">
				<div class="col-md-8 offset-2 jumbotron" style="margin-top: 4rem;">
					<h1>{{ state.status }} {{ state.statusText }}</h1>
					<p>{{ state.url }}</p>
					<p>{{ state.message }}</p>
					<p *hasRole="'admin'">{{ state.stack }}</p>
				</div>
			</div>
		</div>
	`
})
export class ErrorComponent {
	state: ErrorState = {
		status: 500,
		statusText: '',
		message: 'Unknown error occurred.',
		url: '/'
	};

	constructor(private router: Router) {
		const s = this.router.getCurrentNavigation()?.extras?.state;
		if (s) {
			this.state = s as ErrorState;
		}
	}
}
