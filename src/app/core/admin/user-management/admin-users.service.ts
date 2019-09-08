import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import isArray from 'lodash/isArray';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { PagingOptions, PagingResults } from '../../../common/paging.module';
import { User } from '../../auth/user.model';

@Injectable()
/**
 * Admin management of users
 */
export class AdminUsersService {

	cache: any = {};

	constructor(private http: HttpClient) {}

	search(query: any, search: string, paging: PagingOptions, options: any): Observable<PagingResults> {
		return this.http.post(
			'api/admin/users',
			{ q: query, s: search, options: options },
			{ params: paging.toObj() }
		).pipe(
			map((results: PagingResults) => {
				if (null != results && isArray(results.elements)) {
					results.elements = results.elements.map((element: any) => new User().setFromUserModel(element));
				}
				return results;
			})
		);
	}

	match(query: any, search: string, paging: PagingOptions, options: any): Observable<PagingResults> {
		return this.http.post(
			'api/users/match',
			{ q: query, s: search, options: options },
			{ params: paging.toObj() }
		).pipe(
			map((results: PagingResults) => {
				if (null != results && isArray(results.elements)) {
					results.elements = results.elements.map((element: any) => new User().setFromUserModel(element));
				}
				return results;
			})
		);
	}

	removeUser(id: string) {
		return this.http.delete(`api/admin/user/${id}`);
	}

	getAll(query: any, field: string) {
		return this.http.post('api/admin/users/getAll', { query: query, field: field });
	}

	create(user: User) {
		return this.http.post('api/admin/user', user.userModel);
	}

	get(userId: string) {
		return this.http.get(`api/admin/user/${userId}`);
	}

	update(user: User): Observable<any> {
		return this.http.post(`api/admin/user/${user.userModel._id}`, user.userModel);
	}

}
