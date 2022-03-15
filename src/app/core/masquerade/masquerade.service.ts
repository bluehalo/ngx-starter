import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { of, Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { NULL_PAGING_RESULTS, PagingResults } from '../../common/paging/paging.model';
import { LocalStorageService } from '../../common/storage/local-storage.service';
import { User } from '../auth/user.model';

@Injectable()
export class MasqueradeService {
	LOCAL_STORAGE_KEY = 'MASQ_DN';

	storage = new LocalStorageService();

	constructor(private http: HttpClient) {}

	clear() {
		this.storage.removeValue(this.LOCAL_STORAGE_KEY);
	}

	setMasqueradeDn(dn: string | null | undefined) {
		this.storage.setValue(this.LOCAL_STORAGE_KEY, dn);
	}

	getMasqueradeDn(): string | undefined {
		return this.storage.getValue(this.LOCAL_STORAGE_KEY);
	}

	searchUsers(
		query: any = {},
		search: string = '',
		options: any = {}
	): Observable<PagingResults<User>> {
		return this.http.post<PagingResults>('api/users', { q: query, s: search, options }).pipe(
			tap((results: PagingResults) => {
				if (null != results && Array.isArray(results.elements)) {
					results.elements = results.elements.map((element: any) =>
						new User().setFromUserModel(element)
					);
				}
			}),
			catchError(() => of(NULL_PAGING_RESULTS))
		);
	}
}
