import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, of } from 'rxjs';

import { NULL_PAGING_RESULTS, PagingOptions, PagingResults } from '../../../common/paging.module';
import { EndUserAgreement } from './eua.model';
import { SystemAlertService } from '../../../common/system-alert/system-alert.service';
import { catchError, map } from 'rxjs/operators';
import { User } from '../../auth/user.model';

@Injectable()
/**
 * Admin management of users
 */
export class EuaService {
	public cache: any = {};

	constructor(private http: HttpClient, private alertService: SystemAlertService) {}

	/**
	 * Public methods to be exposed through the service
	 */

	// Create
	create(eua: EndUserAgreement): Observable<any> {
		return this.http.post('api/eua', eua.euaModel);
	}

	// Retrieve
	get(id: string): Observable<any> {
		return this.http.get(`api/eua/${id}`);
	}

	// Search Euas
	search(
		query: any,
		search: string,
		paging: PagingOptions,
		options: any
	): Observable<PagingResults<EndUserAgreement>> {
		return this.http
			.post('api/euas', { q: query, s: search, options }, { params: paging.toObj() })
			.pipe(
				map((results: PagingResults) => {
					if (null != results && Array.isArray(results.elements)) {
						results.elements = results.elements.map((element: any) =>
							new EndUserAgreement().setFromEuaModel(element)
						);
					}
					return results;
				}),
				catchError(error => {
					this.alertService.addClientErrorAlert(error);
					return of(NULL_PAGING_RESULTS);
				})
			);
	}

	// Update
	update(eua: EndUserAgreement): Observable<any> {
		return this.http.post(`api/eua/${eua.euaModel._id}`, eua.euaModel);
	}

	// Delete
	remove(id: string): Observable<any> {
		return this.http.delete(`api/eua/${id}`);
	}

	publish(id: string): Observable<any> {
		return this.http.post(`api/eua/${id}/publish`, {});
	}
}
