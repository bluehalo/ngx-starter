import { Injectable } from '@angular/core';
import {NavigationExtras, Router} from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { assign, isEmpty } from 'lodash';
import { BehaviorSubject, Observable } from 'rxjs/index';
import { tap } from 'rxjs/operators';

import { AuthenticationService } from './authentication.service';
import { Session } from './session.model';


@Injectable()
export class SessionService {

	// The current session information
	sessionSubject = new BehaviorSubject<Session>(null);

	// Previous url to store in case we want to redirect there later
	private previousUrl: string;

	constructor(
		private authService: AuthenticationService,
		private http: HttpClient,
		private router: Router,
	) {}

	signin(username: string, password: string) {
		return this.authService.signin(username, password).pipe(
			tap((result) => {
				this.sessionSubject.next(result);
			})
		);
	}

	clear() {
		this.sessionSubject.next(null);
	}

	getSession(): Observable<Session> {
		return this.sessionSubject;
	}

	setPreviousUrl(url: string) {
		this.previousUrl = url;
	}

	goToPreviousRoute() {
		this.goToRoute(this.previousUrl, { replaceUrl: true });
	}

	private goToRoute(url: string, extras?: NavigationExtras) {

		// Redirect the user to a URL
		if (null == url) {
			url = '/';
		}
		url = url.split('?')[0];

		let queryParams = this.parseQueryParams(url);
		if (!isEmpty(queryParams)) {
			if (null == extras) {
				extras = {};
			}
			extras = assign(extras, { queryParams: queryParams });
		}

		// Redirect the user
		this.router.navigate([ url ], extras);
	}

	private parseQueryParams(url: string): any {
		let queryParams = {};

		if (url && -1 !== url.indexOf('?')) {
			let queryParamString = url.split('?')[1];
			const paramSegments = (!isEmpty(queryParamString)) ? queryParamString.split('&') : [];
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
