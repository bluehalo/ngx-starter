import { Component, OnDestroy, OnInit } from '@angular/core';

import { get } from 'lodash';

import { Config } from '../config.model';
import { ConfigService } from '../config.service';
import { SessionService } from '../auth/session.service';

@Component({
	templateUrl: 'signin.component.html',
	styleUrls: [ 'signin.component.scss' ]
})
export class SigninComponent implements OnDestroy, OnInit {

	loaded = false;
	pkiMode = false;

	username: string;
	password: string;
	error: string;

	constructor(
		private configService: ConfigService,
		private sessionService: SessionService
	) {}


	ngOnInit() {
		this.configService.getConfig().subscribe((config: Config) => {
			this.pkiMode = config.auth === 'proxy-pki';
			this.loaded = true;

			if (this.pkiMode) {
				// Automatically sign in
				this.signin();
			}
		});
	}

	signin() {
		this.sessionService.signin(this.username, this.password).subscribe(
			(result) => {
				this.sessionService.goToPreviousRoute();
			},
			(error) => {
				this.error = get(error, 'error.message', 'Unexpected error signing in.');
			}
		);
	}

	ngOnDestroy() {

	}
}
