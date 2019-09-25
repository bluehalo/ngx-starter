import { Injectable } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import assign from 'lodash/assign';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import { BehaviorSubject, Observable, of, pipe } from 'rxjs/index';
import { catchError, map, tap } from 'rxjs/operators';

import { AuthenticationService } from './authentication.service';
import { Session } from './session.model';
import { User } from './user.model';
import { ConfigService } from '../config.service';

@Injectable()
export class SessionService {

	// The current session information
	sessionSubject = new BehaviorSubject<Session>(null);

	// Previous url to store in case we want to redirect there later
	private previousUrl: string;

	private readonly mapUserModelToSession = pipe(
		map((result: any) => {
			if (result == null) {
				return result;
			}
			const user = new User();
			user.setFromUserModel(result);
			return {
				name: result.name,
				user
			};
		})
	);

	constructor(
		private authService: AuthenticationService,
		private configService: ConfigService,
		private http: HttpClient,
		private router: Router,
	) {}

	reloadSession(): Observable<any> {
		return this.authService.reloadCurrentUser().pipe(
			catchError(() => {
				return of(null);
			}),
			this.mapUserModelToSession,
			tap((session) => {
				this.sessionSubject.next(session);
			})
		);
	}

	signin(username: string, password: string): Observable<any> {
		return this.authService.signin(username, password).pipe(
			this.mapUserModelToSession,
			tap((session) => {
				this.sessionSubject.next(session);
			})
		);
	}

	getCurrentEua(): Observable<any> {
		if (get(this.sessionSubject, 'value.user.eua', undefined) !== undefined) {
			return of(this.sessionSubject.value.user.eua);
		}
		return this.authService.getCurrentEua().pipe(
			catchError(() => {
				return of(null);
			}),
			tap((eua: any) => {
				this.sessionSubject.value.user.setEua(eua);
				this.sessionSubject.next(this.sessionSubject.value);
			})
		);
	}

	acceptEua(): Observable<any> {
		return this.authService.acceptEua().pipe(
			catchError(() => {
				return of(null);
			}),
			this.mapUserModelToSession,
			tap((session) => {
				this.sessionSubject.next(session);
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

		const queryParams = this.parseQueryParams(url);
		if (!isEmpty(queryParams)) {
			if (null == extras) {
				extras = {};
			}
			extras = assign(extras, { queryParams });
		}

		// Redirect the user
		this.router.navigate([ url ], extras);
	}

	private parseQueryParams(url: string): any {
		const queryParams = {};

		if (url && -1 !== url.indexOf('?')) {
			const queryParamString = url.split('?')[1];
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
