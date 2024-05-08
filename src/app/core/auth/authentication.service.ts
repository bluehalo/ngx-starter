import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { EndUserAgreement } from '../admin/end-user-agreement/eua.model';
import { EditUser } from './user.model';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
	private http = inject(HttpClient);

	signin(username: string, password: string): Observable<unknown> {
		return this.http.post('api/auth/signin', { username, password });
	}

	signup(user: EditUser): Observable<unknown> {
		return this.http.post('api/auth/signup', user);
	}

	reloadCurrentUser(): Observable<unknown> {
		return this.http.get('api/user/me');
	}

	getCurrentEua(): Observable<EndUserAgreement | undefined> {
		return this.http.get('api/eua').pipe(
			map((model) => {
				if (model) {
					return new EndUserAgreement(model);
				}
				return undefined;
			})
		);
	}

	acceptEua(): Observable<unknown> {
		return this.http.post('api/eua/accept', {});
	}
}
