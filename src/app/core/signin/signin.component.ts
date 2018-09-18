import { Component } from '@angular/core';

import * as _ from 'lodash';

@Component({
	templateUrl: 'signin.component.html'
})
export class SigninComponent {

	username: string;
	password: string;
	error: string;
	pkiMode: boolean = false;

	constructor() {}

	signin() {

	}


	/**
	 * Validate a pair of passwords
	 * The server will perform full validation, so for now all we're really doing is
	 * verifying that the two passwords are the same.
	 */
	validatePassword(p1: string, p2: string): any {
		p1 = (_.isString(p1) && p1.trim().length > 0) ? p1 : undefined;
		p2 = (_.isString(p2) && p2.trim().length > 0) ? p2 : undefined;

		if (p1 !== p2) {
			return { valid: false, message: 'Passwords do not match' };
		}
		else {
			return { valid: true };
		}
	}

}
