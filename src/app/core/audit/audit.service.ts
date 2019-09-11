import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PagingOptions, PagingResults } from '../../common/paging.module';
import _isArray from 'lodash/isArray';

import { User } from '../auth/user.model';

@Injectable()
export class AuditService {

	private viewDetailsActions: string[] = [
		'create',
		'delete'
	];

	private viewChangesActions: string[] = [
		'update',
		'admin update'
	];

	constructor(private http: HttpClient) {}

	public isViewDetailsAction(action: string) {
		return this.viewDetailsActions.includes(action);
	}

	public addViewDetailsAction(action: string) {
		this.viewDetailsActions.push(action);
	}

	public isViewChangesAction(action: string) {
		return this.viewChangesActions.includes(action);
	}

	public addViewChangesAction(action: string) {
		this.viewChangesActions.push(action);
	}

	public getDistinctAuditValues(field: string): Observable<string[]> {
		return this.http.get<string[]>('api/audit/distinctValues', { params: { field: field } });
	}

	public search(query: any, search: string, paging: PagingOptions): Observable<PagingResults> {
		return this.http.post<PagingResults>(
			'api/audit',
			{ q: query, s: search },
			{ params: paging.toObj() }
		);
	}

	public matchUser(query: any, search: string, paging: PagingOptions, options: any): Observable<PagingResults> {
		return this.http.post(
			'api/users/match',
			{ q: query, s: search, options: options },
			{ params: paging.toObj() }
		).pipe(
			map((results: PagingResults) => {
				if (null != results && _isArray(results.elements)) {
					results.elements = results.elements.map((element: any) => new User().setFromUserModel(element));
				}
				return results;
			})
		);
	}
}
