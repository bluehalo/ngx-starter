import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import * as _ from 'lodash';
import { Observable } from 'rxjs';

import { PagingOptions } from '../../../common/paging/pager/pager.component';
import { User } from '../../auth/user.model';

@Injectable()
/**
 * Admin management of users
 */
export class AdminUsersService {

	cache: any = {};

	constructor(private http: HttpClient) {}

	search(query: any, search: string, paging: PagingOptions, options: any): Observable<any> {
		return Observable.create((observer: any) => {

			const params = new HttpParams();
			Object.keys(paging).forEach( (key) => params.set(key, paging[key]) );

			const url = `api/admin/users?${params.toString()}`;
			const body = { q: query, s: search, options: options };
			this.http.post(url, body)
				.subscribe(
					(results: any) => {
						if (null != results && _.isArray(results.elements)) {
							results.elements = results.elements.map((element: any) => new User().setFromUserModel(element));
						}
						observer.next(results);
					},
					(err: any) => {
						observer.error(err);
					},
					() => {
						observer.complete();
					});
		});
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

	update(user: User) {
		return this.http.post(`api/admin/user/${user.userModel._id}`, user.userModel);
	}

}
