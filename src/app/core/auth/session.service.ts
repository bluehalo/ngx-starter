import { Injectable } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';

import { UntilDestroy } from '@ngneat/until-destroy';
import isEmpty from 'lodash/isEmpty';
import { of, pipe, BehaviorSubject, Observable } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { AuthenticationService } from './authentication.service';
import { Session } from './session.model';
import { User } from './user.model';

@UntilDestroy()
@Injectable()
export class SessionService {
	// The current session information
	sessionSubject$ = new BehaviorSubject<Session | null>(null);

	private readonly mapUserModelToSession = pipe(
		map((result: any): Session | null => {
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

	constructor(private authService: AuthenticationService, private router: Router) {}

	reloadSession(): Observable<Session | null> {
		return this.authService.reloadCurrentUser().pipe(
			catchError(() => {
				return of(null);
			}),
			this.mapUserModelToSession,
			tap((session) => {
				this.sessionSubject$.next(session);
			})
		);
	}

	signin(username: string, password: string): Observable<Session | null> {
		return this.authService.signin(username, password).pipe(
			this.mapUserModelToSession,
			tap((session) => {
				this.sessionSubject$.next(session);
			})
		);
	}

	getCurrentEua(): Observable<any> {
		if (this.sessionSubject$?.value?.user?.eua !== undefined) {
			return of(this.sessionSubject$.value.user.eua);
		}
		return this.authService.getCurrentEua().pipe(
			catchError(() => {
				return of(null);
			}),
			tap((eua: any) => {
				this.sessionSubject$.value?.user.setEua(eua);
				this.sessionSubject$.next(this.sessionSubject$.value);
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
				this.sessionSubject$.next(session);
			})
		);
	}

	clear() {
		this.sessionSubject$.next(null);
	}

	getSession(): Observable<Session | null> {
		return this.sessionSubject$;
	}
}
