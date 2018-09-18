import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import * as _ from 'lodash';
import { Observable, of } from 'rxjs';

import { AuthenticationService } from './authentication.service';
import { User } from './user.model';

@Injectable()
export class SessionService {

	// Previous url to store in case we want to redirect there later
	previousUrl: string;

	user: any = null;

	constructor(private router: Router, private authService: AuthenticationService) {}

	getUser(): Observable<User> {
		if (null == this.user) {
			return this.authService.getCurrentUser();
		}
		else {
			return of(this.user);
		}
	}


	isAuthenticated(): boolean {
		return (null != this.user);
	}

	requiresEua(): boolean {

	}

	clearUser() {
		this.user = null;
	}

	goToPreviousRoute() {
		this.goToRoute(this.previousUrl);
	}

	private goToRoute(url: string) {

		// Redirect the user to a URL
		if (null == url) {
			url = '/';
		}
		url = url.split('?')[0];

		let queryParams = this.parseQueryParams(url);
		if (!_.isEmpty(queryParams)) {
			// Redirect the user, preserving query params
			this.router.navigate([ url ], { queryParams: queryParams });
		}
		else {
			// Redirect the user
			this.router.navigate([ url ]);
		}
	}

	private parseQueryParams(url: string): any {
		let queryParams = {};

		if (url && -1 !== url.indexOf('?')) {
			let queryParamString = url.split('?')[1];
			const paramSegments = (!_.isEmpty(queryParamString)) ? queryParamString.split('&') : [];
			paramSegments.forEach((segment: string) => {
				const keyValuePair = segment.split('=');
				if (keyValuePair.length === 2) {
					queryParams[keyValuePair[0]] = keyValuePair[1];
				}
			});
		}

		return queryParams;
	}


}
