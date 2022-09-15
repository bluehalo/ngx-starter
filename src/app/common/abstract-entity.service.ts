import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';

import { of, Observable } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { NULL_PAGING_RESULTS, PagingOptions, PagingResults } from './paging.module';
import { SystemAlertService } from './system-alert/system-alert.service';

export enum ServiceMethod {
	create = 'create',
	read = 'read',
	update = 'update',
	delete = 'delete',
	search = 'search'
}

export abstract class AbstractEntityService<T extends { _id: string }> {
	headers: any = { 'Content-Type': 'application/json' };

	protected http = inject(HttpClient);
	protected alertService = inject(SystemAlertService);

	protected constructor(protected urls: Record<ServiceMethod | string, string>) {}

	abstract mapToType(model: any): T;

	getMethodUrl(method: ServiceMethod | string, entityOrId?: Pick<T, '_id'> | string): string {
		const url = this.urls[method];
		if (!url) {
			throw new Error(`Method '${method}' is not supported.`);
		}
		if (typeof entityOrId === 'string') {
			return `${url}/${entityOrId}`;
		}
		if (entityOrId) {
			return `${url}/${entityOrId._id}`;
		}
		return url;
	}

	create(t: T): Observable<T | null> {
		return this.http
			.post(this.getMethodUrl(ServiceMethod.create), t, { headers: this.headers })
			.pipe(
				map((model) => this.mapToType(model)),
				catchError((error: unknown) => this.handleError(error, null))
			);
	}

	read(id: string): Observable<T | null> {
		return this.http.get(this.getMethodUrl(ServiceMethod.read, id)).pipe(
			map((model) => this.mapToType(model)),
			catchError((error: unknown) => this.handleError(error, null))
		);
	}

	update(t: T): Observable<T | null> {
		return this.http
			.post(this.getMethodUrl(ServiceMethod.update, t), t, {
				headers: this.headers
			})
			.pipe(
				map((model) => this.mapToType(model)),
				catchError((error: unknown) => this.handleError(error, null))
			);
	}

	delete(t: T): Observable<T | null> {
		return this.http.delete(this.getMethodUrl(ServiceMethod.delete, t)).pipe(
			map((model) => this.mapToType(model)),
			catchError((error: unknown) => this.handleError(error, null))
		);
	}

	search(
		paging: PagingOptions,
		query: Record<string, any> = {},
		search: string = '',
		body: any = null,
		params: any = null,
		options: any = {},
		urlOverride?: string
	): Observable<PagingResults<T>> {
		return this.http
			.post<PagingResults>(
				urlOverride ?? this.getMethodUrl(ServiceMethod.search),
				{ s: search, q: query, options, ...body },
				{
					params: { ...paging.toObj(), ...params },
					headers: this.headers
				}
			)
			.pipe(
				tap((pagingResult) => {
					pagingResult.elements = pagingResult.elements.map((model: any) =>
						this.mapToType(model)
					);
				}),
				catchError((error: unknown) => this.handleError(error, NULL_PAGING_RESULTS))
			);
	}

	updateAction(action: string, t: Pick<T, '_id'>, body: any | null = null): Observable<T | null> {
		return this.http
			.post(`${this.getMethodUrl(ServiceMethod.update, t)}/${action}`, body, {
				headers: this.headers
			})
			.pipe(
				map((model) => this.mapToType(model)),
				catchError((error: unknown) => this.handleError(error, null))
			);
	}

	handleError<ReturnType>(error: unknown, returnValue: ReturnType) {
		if (error instanceof HttpErrorResponse) {
			if (error.status === 400 && error.error.errors) {
				const vError = error.error.errors.body?.[0] || error.error.errors.query?.[0];
				if (vError) {
					this.alertService.addAlert(
						`Validation Error: ${vError.dataPath.substring(1)} ${vError.message}`
					);
				} else {
					this.alertService.addAlert('Validation Error');
				}
			} else {
				this.alertService.addClientErrorAlert(error);
			}
		}
		return of(returnValue);
	}
}
