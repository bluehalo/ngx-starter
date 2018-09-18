import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import * as _ from 'lodash';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';


import { User } from './user.model';
import { SessionService } from './session.service';

@Injectable()
export class AuthenticationService {

	constructor(
		private sessionService: SessionService,
		private http: HttpClient
	) {}

	signin(username: string, password: string): Observable<any> {
		return this.http.post('auth/signin', { username: username, password: password } );
	}


	getCurrentUser(): Observable<any> {
		return this.http.get('user/me');
	}

	acceptEua(): Observable<any> {
		return this.http.post('eua/accept', {});
	}

	getCurrentEua(): Observable<any> {
		return this.http.get('eua');
	}

}
