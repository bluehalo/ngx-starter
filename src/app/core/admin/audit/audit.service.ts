import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PagingOptions, PagingResults } from '../../../common/paging.module';
import _isArray from 'lodash/isArray';

@Injectable()
export class AuditService {
	constructor(private http: HttpClient) {}

	public getDistinctAuditValues(field: string): Observable<Response> {
		return this.http.get<Response>('audit/distinctValues', { params: { field: field } });
	}

	public search(query: any, search: string, paging: PagingOptions): Observable<PagingResults> {
		return this.http.post<PagingResults>(
			'audit',
			{ q: query, s: search },
			{ params: paging.toObj() }
		);
	}
}
