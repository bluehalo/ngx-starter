import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { PagingOptions } from '../../../common/paging.module';
import { EndUserAgreement } from './eua.model';

@Injectable()
/**
 * Admin management of users
 */
export class EuaService {

	public cache: any = {};

	constructor(private http: HttpClient) {}

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
	search(query: any, search: string , paging: PagingOptions, options: any): Observable<any> {
		return this.http.post(
			'api/euas',
			{q: query, s: search, options: options},
			{ params: paging.toObj() }
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
