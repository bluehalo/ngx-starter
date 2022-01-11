import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { of, Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { NULL_PAGING_RESULTS, PagingOptions, PagingResults } from '../../../common/paging.module';
import { SystemAlertService } from '../../../common/system-alert/system-alert.service';
import { EndUserAgreement } from './eua.model';

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
	create(eua: EndUserAgreement): Observable<EndUserAgreement> {
		return this.http
			.post('api/eua', eua.euaModel)
			.pipe(map((result) => new EndUserAgreement().setFromEuaModel(result)));
	}

	// Retrieve
	get(id: string): Observable<EndUserAgreement> {
		return this.http
			.get(`api/eua/${id}`)
			.pipe(map((result) => new EndUserAgreement().setFromEuaModel(result)));
	}

	// Search Euas
	search(
		query: any,
		search: string,
		paging: PagingOptions,
		options: any
	): Observable<PagingResults<EndUserAgreement>> {
		return this.http
			.post<PagingResults>(
				'api/euas',
				{ q: query, s: search, options },
				{ params: paging.toObj() }
			)
			.pipe(
				map((results: PagingResults) => {
					if (null != results && Array.isArray(results.elements)) {
						results.elements = results.elements.map((element: any) =>
							new EndUserAgreement().setFromEuaModel(element)
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

	// Update
	update(eua: EndUserAgreement): Observable<EndUserAgreement> {
		return this.http
			.post(`api/eua/${eua.euaModel._id}`, eua.euaModel)
			.pipe(map((result) => new EndUserAgreement().setFromEuaModel(result)));
	}

	// Delete
	remove(id: string): Observable<EndUserAgreement> {
		return this.http
			.delete(`api/eua/${id}`)
			.pipe(map((result) => new EndUserAgreement().setFromEuaModel(result)));
	}

	publish(id: string): Observable<EndUserAgreement> {
		return this.http
			.post(`api/eua/${id}/publish`, {})
			.pipe(map((result) => new EndUserAgreement().setFromEuaModel(result)));
	}
}
