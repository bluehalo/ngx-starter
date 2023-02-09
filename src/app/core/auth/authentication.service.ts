import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { User } from './user.model';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
	constructor(private http: HttpClient) {}

	signin(username: string, password: string): Observable<any> {
		return this.http.post('api/auth/signin', { username, password });
	}

	signup(user: User): Observable<any> {
		return this.http.post('api/auth/signup', user.userModel);
	}

	reloadCurrentUser(): Observable<any> {
		return this.http.get('api/user/me');
	}

	logout() {}

	getCurrentEua(): Observable<any> {
		return this.http.get('api/eua');
	}

	acceptEua(): Observable<any> {
		return this.http.post('api/eua/accept', {});
	}
}
