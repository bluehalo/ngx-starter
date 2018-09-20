import { Component, OnInit } from '@angular/core';

import * as _ from 'lodash';

import { Config } from '../config.model';
import { ConfigService } from '../config.service';
import { SessionService } from '../auth/session.service';

@Component({
	templateUrl: 'signin.component.html',
	styleUrls: [ 'signin.component.scss' ]
})
export class SigninComponent implements OnInit {

	username: string;
	password: string;
	error: string;
	pkiMode: boolean = false;

	constructor(
		private configService: ConfigService,
		private sessionService: SessionService
	) {}


	ngOnInit() {
		this.configService.getConfig().subscribe((config: Config) => {
			this.pkiMode = config.auth === 'proxy-pki';
		});
	}

	signin() {
		this.sessionService.signin(this.username, this.password).subscribe(
			(result) => {
				this.sessionService.goToPreviousRoute();
			},
			(error) => {
				this.error = _.get(error, 'error.message', 'Unexpected error signing in.');
			}
		);
	}

}
