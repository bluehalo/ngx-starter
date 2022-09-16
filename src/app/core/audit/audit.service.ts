import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { of, Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { NULL_PAGING_RESULTS, PagingOptions, PagingResults } from '../../common/paging.model';
import { SystemAlertService } from '../../common/system-alert/system-alert.service';
import { User } from '../auth/user.model';
import { AuditActionTypes } from './audit.classes';

@Injectable()
export class AuditService {
	constructor(private http: HttpClient, private alertService: SystemAlertService) {}

	public getDistinctAuditValues(field: string): Observable<string[]> {
		return this.http.get<string[]>('api/audit/distinctValues', { params: { field } });
	}

	public search(query: any, search: string, paging: PagingOptions): Observable<PagingResults> {
		return this.http
			.post<PagingResults>('api/audit', { q: query, s: search }, { params: paging.toObj() })
			.pipe(
				map((results: PagingResults) => {
					if (null != results && Array.isArray(results.elements)) {
						results.elements.forEach((entry) => {
							entry.isViewDetailsAction = AuditActionTypes.isViewDetailsAction(
								entry.audit.action
							);
							entry.isViewChangesAction = AuditActionTypes.isViewChangesAction(
								entry.audit.action
							);
						});
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

	public matchUser(
		query: any,
		search: string,
		paging: PagingOptions,
		options: any
	): Observable<PagingResults> {
		return this.http
			.post<PagingResults>(
				'api/users/match',
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
				})
			);
	}
}
