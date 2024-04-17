import { Component } from '@angular/core';

@Component({
	selector: 'example-welcome',
	template: `
		<div class="container">
			<div class="row">
				<div class="col">
					<h1>Welcome Page</h1>
					<p>Simple demonstration of routing.</p>
				</div>
			</div>
		</div>
	`,
	standalone: true
})
export class WelcomeComponent {}
