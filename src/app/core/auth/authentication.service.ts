import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class AuthenticationService {

	constructor(
		private http: HttpClient
	) {}

	signin(username: string, password: string): Observable<any> {
		return this.http.post('api/auth/signin', { username, password });
	}

	logout() {
	}

}
