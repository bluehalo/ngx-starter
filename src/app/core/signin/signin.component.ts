import { Component, OnInit } from '@angular/core';

import { untilDestroyed, UntilDestroy } from '@ngneat/until-destroy';
import { first } from 'rxjs/operators';

import { SessionService } from '../auth/session.service';
import { ConfigService } from '../config.service';
import { NavigationService } from '../navigation.service';

@UntilDestroy()
@Component({
	templateUrl: 'signin.component.html',
	styleUrls: ['signin.component.scss']
})
export class SigninComponent implements OnInit {
	loaded = false;
	pkiMode = false;

	username: string;
	password: string;
	error: string;

	constructor(
		private configService: ConfigService,
		private sessionService: SessionService,
		private navigationService: NavigationService
	) {}

	ngOnInit() {
		this.configService
			.getConfig()
			.pipe(first(), untilDestroyed(this))
			.subscribe((config) => {
				this.pkiMode = config?.auth.startsWith('proxy-pki') ?? false;
				this.loaded = true;

				if (this.pkiMode) {
					// Automatically sign in
					this.signin();
				}
			});
	}

	signin() {
		this.sessionService
			.signin(this.username, this.password)
			.pipe(untilDestroyed(this))
			.subscribe({
				next: (result) => {
					this.navigationService.navigateToPreviousRoute();
				},
				error: (error) => {
					this.error = error?.error?.message ?? 'Unexpected error signing in.';
				}
			});
	}
}
