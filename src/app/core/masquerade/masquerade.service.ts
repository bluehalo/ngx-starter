import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { NULL_PAGING_RESULTS, PagingResults } from '../../common/paging.model';
import { LocalStorageService } from '../../common/storage/local-storage.service';
import { User } from '../auth';

const LOCAL_STORAGE_KEY = 'MASQ_DN';

@Injectable({ providedIn: 'root' })
export class MasqueradeService {
	#http = inject(HttpClient);

	#storage = new LocalStorageService();

	clear() {
		this.#storage.removeValue(LOCAL_STORAGE_KEY);
	}

	setMasqueradeDn(dn: string | null | undefined) {
		this.#storage.setValue(LOCAL_STORAGE_KEY, dn);
	}

	getMasqueradeDn(): string | undefined {
		return this.#storage.getValue(LOCAL_STORAGE_KEY);
	}

	searchUsers(query: any = {}, search = '', options: any = {}): Observable<PagingResults<User>> {
		return this.#http.post<PagingResults>('api/users', { q: query, s: search, options }).pipe(
			tap((results: PagingResults) => {
				if (Array.isArray(results?.elements)) {
					results.elements = results.elements.map((element: any) => new User(element));
				}
			}),
			catchError(() => of(NULL_PAGING_RESULTS))
		);
	}
}
