import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import * as _ from 'lodash';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

import { AuthenticationService } from './authentication.service';
import { Session } from './session.model';


@Injectable()
export class SessionService {

	// Previous url to store in case we want to redirect there later
	private previousUrl: string;

	// The current session information
	private session: Session = null;

	constructor(
		private authService: AuthenticationService,
		private http: HttpClient,
		private router: Router,
	) {}

	clear() {
		this.session = null;
	}

	signin(username: string, password: string) {
		return this.authService.signin(username, password).pipe(
			tap((result) => {
				this.session = result;
			})
		);

	}

	getSession(): Session {
		return this.session;
	}

	setPreviousUrl(url: string) {
		this.previousUrl = url;
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
