import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router } from '@angular/router';

import get from 'lodash/get';

import { AuthorizationService } from './auth/authorization.service';
import { SessionService } from './auth/session.service';

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div class="container">
			<div class="row">
				<div class="col-md-8 offset-2 jumbotron" style="margin-top: 4rem;">

					<h1 [innerHTML]="title"></h1>
					<p [innerHTML]="message"></p>

				</div>
			</div>
		</div>
	`,
	styles: [ '' ]
})
export class InactiveComponent {

	title: string = 'Account Not Active';

	message: string = `The good news is that you've got an account. The bad news is that it isn't active right now.
			Either we temporarily disabled it, or you just requested an account and we haven't had a chance to approve your access yet.`;

	constructor(
		private auth: AuthorizationService,
		private sessionService: SessionService,
		private router: Router
	) {
		if (this.auth.isUser()) {
			this.router.navigate(['/welcome']);
		} else {
			const name = get(this.sessionService.getSession(), 'value.name', 'Unknown User');
			if (null != name) {
				this.message = `Hey there, ${name}. ${this.message}`;
			}
		}
	}
}
