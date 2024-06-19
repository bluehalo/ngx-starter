import { Injectable, inject, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { AuthenticationService } from './authentication.service';
import { EndUserAgreement } from './eua.model';
import { Session } from './session.model';

@Injectable({
	providedIn: 'root'
})
export class SessionService {
	readonly #authService = inject(AuthenticationService);

	// The current session information
	readonly #session = signal(new Session());

	readonly #sessionSubject$ = toObservable(this.#session);

	get session() {
		return this.#session.asReadonly();
	}

	reloadSession(): Observable<Session> {
		return this.#authService.reloadCurrentUser().pipe(
			catchError(() => {
				return of(null);
			}),
			map((userModel) => new Session(userModel)),
			tap((session) => {
				this.#session.set(session);
			})
		);
	}

	signin(username: string, password: string): Observable<Session> {
		return this.#authService.signin(username, password).pipe(
			map((userModel) => new Session(userModel)),
			tap((session) => {
				this.#session.set(session);
			})
		);
	}

	getCurrentEua(): Observable<EndUserAgreement | undefined> {
		if (this.#session().user?.eua) {
			return of(this.#session().user?.eua);
		}
		return this.#authService.getCurrentEua().pipe(
			catchError(() => {
				return of(undefined);
			}),
			tap((eua) => {
				this.#session.update((session) => {
					session.user?.setEua(eua);
					return new Session(session.user);
				});
			})
		);
	}

	acceptEua(): Observable<any> {
		return this.#authService.acceptEua().pipe(
			catchError(() => {
				return of(null);
			}),
			tap((userModel) => {
				this.#session.set(new Session(userModel));
			})
		);
	}

	clear() {
		this.#session.set(new Session());
	}

	/**
	 * @deprecated Should use session signal instead
	 */
	getSession(): Observable<Session> {
		return this.#sessionSubject$;
	}
}
