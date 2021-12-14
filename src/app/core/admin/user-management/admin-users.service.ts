import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { of, Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { NULL_PAGING_RESULTS, PagingOptions, PagingResults } from '../../../common/paging.module';
import { SystemAlertService } from '../../../common/system-alert/system-alert.service';
import { User } from '../../auth/user.model';

@Injectable()
/**
 * Admin management of users
 */
export class AdminUsersService {
	cache: any = {};

	constructor(private http: HttpClient, private alertService: SystemAlertService) {}

	search(
		query: any,
		search: string,
		paging: PagingOptions,
		options: any
	): Observable<PagingResults<User>> {
		return this.http
			.post<PagingResults>(
				'api/admin/users',
				{ q: query, s: search, options },
				{ params: paging.toObj() }
			)
			.pipe(
				map((results: PagingResults) => {
					if (null != results && Array.isArray(results.elements)) {
						results.elements = results.elements.map((element: any) =>
							new User().setFromUserModel(element)
						);
					}
					return results;
				}),
				catchError((error) => {
					this.alertService.addClientErrorAlert(error);
					return of(NULL_PAGING_RESULTS);
				})
			);
	}

	removeUser(id: string) {
		return this.http.delete(`api/admin/user/${id}`);
	}

	getAll(query: any, field: string) {
		return this.http.post('api/admin/users/getAll', { query, field });
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
