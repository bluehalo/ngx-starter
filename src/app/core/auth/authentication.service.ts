import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import { Observable } from 'rxjs';

import { EditUser } from './user.model';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
	private http = inject(HttpClient);

	signin(username: string, password: string): Observable<any> {
		return this.http.post('api/auth/signin', { username, password });
	}

	signup(user: EditUser): Observable<any> {
		return this.http.post('api/auth/signup', user);
	}

	reloadCurrentUser(): Observable<any> {
		return this.http.get('api/user/me');
	}

	logout() {
		// do nothing
	}

	getCurrentEua(): Observable<any> {
		return this.http.get('api/eua');
	}

	acceptEua(): Observable<any> {
		return this.http.post('api/eua/accept', {});
	}
}
