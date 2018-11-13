import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { PagingOptions } from '../../../common/paging.module';
import { CacheEntry } from './cache-entry.model';

@Injectable()
export class CacheEntriesService {

	constructor(private http: HttpClient) {}

	public match(query: any, search: string, paging: PagingOptions): Observable<any> {
		return this.http.post(
			'api/access-checker/entries/match',
			{ s: search, q: query },
			{ params: paging.toObj() }
		);
	}

	public remove(key: string): Observable<any> {
		return this.http.delete(
			`api/access-checker/entry/${ encodeURIComponent(key) }`,
			{ params: { key } } // query parameter 'key'
		);
	}

	public refresh(key: string): Observable<any> {
		return this.http.post(
			`api/access-checker/entry/${ encodeURIComponent(key) }`,
			{}, // empty POST body
			{ params: { key } } // query parameter 'key'
		);
	}

	public refreshCurrentUser(): Observable<any> {
		return this.http.post(
			`api/access-checker/user`,
			{} // empty POST body
		);
	}

}
