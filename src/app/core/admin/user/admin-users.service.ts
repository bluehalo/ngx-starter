import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn, Router, RouterStateSnapshot } from '@angular/router';

import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { NULL_PAGING_RESULTS, PagingOptions, PagingResults } from '../../../common/paging.model';
import { SystemAlertService } from '../../../common/system-alert/system-alert.service';
import { User } from '../../auth';
import { ErrorState } from '../../errors/error-state.model';

export const userResolver: ResolveFn<User | null> = (
	route: ActivatedRouteSnapshot,
	state: RouterStateSnapshot,
	router = inject(Router),
	service = inject(AdminUsersService)
) => {
	const id = route.paramMap.get('id') ?? 'undefined';
	return service.read(id).pipe(catchError((error: unknown) => service.redirectError(error)));
};

/**
 * Admin management of users
 */
@Injectable({ providedIn: 'root' })
export class AdminUsersService {
	private http = inject(HttpClient);
	private alertService = inject(SystemAlertService);
	private router = inject(Router);

	search(
		query: any,
		search: string,
		paging: PagingOptions,
		options: any = {}
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
						results.elements = results.elements.map(
							(element: any) => new User(element)
						);
					}
					return results;
				}),
				catchError((error: unknown) => {
					if (error instanceof HttpErrorResponse) {
						this.alertService.addClientErrorAlert(error);
					}
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
		return this.http.post('api/admin/user', user);
	}

	read(userId: string) {
		return this.http
			.get(`api/admin/user/${userId}`)
			.pipe(map((userRaw: any) => new User(userRaw)));
	}

	update(user: User): Observable<any> {
		return this.http.post(`api/admin/user/${user._id}`, user);
	}

	redirectError(error: unknown) {
		let state: ErrorState = {
			statusText: 'Unknown Error',
			message: 'Unknown Error'
		};
		if (error instanceof HttpErrorResponse) {
			state = {
				status: error.status,
				statusText: error.statusText,
				url: error.url,
				message: error.error?.message ?? error.message,
				stack: error.error?.stack
			};
		}
		this.router.navigate(['/error'], {
			replaceUrl: true,
			state
		});
		return of(null);
	}
}
