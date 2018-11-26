import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

@Injectable()
export class AuthenticationService {

	constructor(
		private http: HttpClient
	) {}

	signin(username: string, password: string): Observable<any> {
		return this.http.post('api/auth/signin', { username, password });
	}

	reloadCurrentUser(): Observable<any> {
		return this.http.get('api/user/me');
	}

	logout() {
	}

	getCurrentEua(): Observable<any> {
		return this.http.get('api/eua');
	}

	acceptEua(): Observable<any> {
		return this.http.post('api/eua/accept', {});
	}
}
