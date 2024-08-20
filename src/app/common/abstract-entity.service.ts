import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { ErrorState } from '../core';
import { NULL_PAGING_RESULTS, PagingOptions, PagingResults } from './paging.model';
import { SystemAlertService } from './system-alert';

export enum ServiceMethod {
	create = 'create',
	read = 'read',
	update = 'update',
	delete = 'delete',
	search = 'search'
}

export abstract class AbstractEntityService<T extends { _id: string }> {
	headers = { 'Content-Type': 'application/json' };

	protected readonly router = inject(Router);
	protected readonly http = inject(HttpClient);
	protected readonly alertService = inject(SystemAlertService);

	protected constructor(
		protected readonly urls: Record<ServiceMethod | string, string>,
		protected readonly createMethod: 'PUT' | 'POST' = 'POST'
	) {}

	abstract mapToType(model: unknown): T;

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
		const obs$ =
			this.createMethod === 'PUT'
				? this.http.put(this.getMethodUrl(ServiceMethod.create), t, {
						headers: this.headers
					})
				: this.http.post(this.getMethodUrl(ServiceMethod.create), t, {
						headers: this.headers
					});
		return obs$.pipe(
			map((model) => this.mapToType(model)),
			catchError((error: unknown) => this.handleError(error, null))
		);
	}

	read(id: string): Observable<T> {
		return this.http
			.get(this.getMethodUrl(ServiceMethod.read, id))
			.pipe(map((model) => this.mapToType(model)));
	}

	update(t: T, params?: object): Observable<T | null> {
		return this.http
			.post(this.getMethodUrl(ServiceMethod.update, t), t, {
				params: { ...params },
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
		query: object = {},
		search = '',
		body?: object,
		params?: object,
		options: object = {},
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
				map((pagingResults) => {
					return {
						...pagingResults,
						elements: pagingResults.elements.map((model) => this.mapToType(model))
					} as PagingResults<T>;
				}),
				catchError((error: unknown) =>
					this.handleError(error, NULL_PAGING_RESULTS as PagingResults<T>)
				)
			);
	}

	updateAction(
		action: string,
		t: Pick<T, '_id'>,
		body: object | null = null
	): Observable<T | null> {
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
