import { Injectable, inject } from '@angular/core';

import { BehaviorSubject, Observable, of, pipe } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { AuthenticationService } from './authentication.service';
import { Session } from './session.model';
import { User } from './user.model';

@Injectable({
	providedIn: 'root'
})
export class SessionService {
	private authService = inject(AuthenticationService);

	// The current session information
	sessionSubject$ = new BehaviorSubject<Session | null>(null);

	private readonly mapUserModelToSession = pipe(
		map((result: any): Session | null => {
			if (result == null) {
				return result;
			}
			return new Session(new User(result));
		})
	);

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
