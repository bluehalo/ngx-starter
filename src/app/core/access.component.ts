import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
	template: `
		<div class="container">
			<div class="row">
				<div class="col-md-8 offset-2 jumbotron" style="margin-top: 4rem;">

					<h1>{{status}}</h1>
					<p>{{message}}</p>

				</div>
			</div>
		</div>
	`,
	styles: [ '' ]
})
export class AccessComponent {

	status: string;
	message: string;


	constructor(
		private router: Router
	) {
		const navigation = this.router.getCurrentNavigation();
		const state = navigation.extras.state;

		if (state) {
			this.status = state.status;
			this.message = state.message;
		}
	}
}
