import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { NULL_PAGING_RESULTS, PagingOptions, PagingResults } from '../../../common/paging.model';
import { SystemAlertService } from '../../../common/system-alert/system-alert.service';
import { CacheEntry } from './cache-entry.model';

@Injectable({ providedIn: 'root' })
export class CacheEntriesService {
	readonly #http = inject(HttpClient);
	readonly #alertService = inject(SystemAlertService);

	public match(
		query: any,
		search: string,
		paging: PagingOptions
	): Observable<PagingResults<CacheEntry>> {
		return this.#http
			.post<
				PagingResults<CacheEntry>
			>('api/access-checker/entries/match', { s: search, q: query }, { params: paging.toObj() })
			.pipe(
				catchError((error: unknown) => {
					if (error instanceof HttpErrorResponse) {
						this.#alertService.addClientErrorAlert(error);
					}
					return of(NULL_PAGING_RESULTS);
				})
			);
	}

	public remove(key: string): Observable<any> {
		return this.#http.delete(
			`api/access-checker/entry/${encodeURIComponent(key)}`,
			{ params: { key } } // query parameter 'key'
		);
	}

	public refresh(key: string): Observable<any> {
		return this.#http.post(
			`api/access-checker/entry/${encodeURIComponent(key)}`,
			{}, // empty POST body
			{ params: { key } } // query parameter 'key'
		);
	}

	public refreshCurrentUser(): Observable<any> {
		return this.#http.post(
			`api/access-checker/user`,
			{} // empty POST body
		);
	}
}
