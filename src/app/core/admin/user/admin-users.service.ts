import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn, Router, RouterStateSnapshot } from '@angular/router';

import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { NULL_PAGING_RESULTS, PagingOptions, PagingResults } from '../../../common';
import { SystemAlertService } from '../../../common/system-alert';
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
	readonly #http = inject(HttpClient);
	readonly #alertService = inject(SystemAlertService);
	readonly #router = inject(Router);

	search(
		paging: PagingOptions,
		query: object = {},
		search = '',
		body?: object,
		options: object = {}
	): Observable<PagingResults<User>> {
		return this.#http
			.post<PagingResults>(
				'api/admin/users',
				{ q: query, s: search, options, ...body },
				{ params: paging.toObj() }
			)
			.pipe(
				map((pagingResults) => {
					return {
						...pagingResults,
						elements: pagingResults.elements.map((model) => new User(model))
					} as PagingResults<User>;
				}),
				catchError((error: unknown) => {
					if (error instanceof HttpErrorResponse) {
						this.#alertService.addClientErrorAlert(error);
					}
					return of(NULL_PAGING_RESULTS as PagingResults<User>);
				})
			);
	}

	removeUser(id: string) {
		return this.#http.delete(`api/admin/user/${id}`);
	}

	getAll(query: object, field: string) {
		return this.#http.post('api/admin/users/getAll', { query, field });
	}

	create(user: User) {
		return this.#http.post('api/admin/user', user);
	}

	read(userId: string) {
		return this.#http
			.get(`api/admin/user/${userId}`)
			.pipe(map((userRaw: unknown) => new User(userRaw)));
	}

	update(user: User): Observable<unknown> {
		return this.#http.post(`api/admin/user/${user._id}`, user);
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
		this.#router.navigate(['/error'], {
			replaceUrl: true,
			state
		});
		return of(null);
	}
}
