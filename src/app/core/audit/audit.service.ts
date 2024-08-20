import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AbstractEntityService, PagingOptions, PagingResults, ServiceMethod } from '../../common';
import { User } from '../auth';
import { AuditEntry } from './audit-entry.model';

// eslint-disable-next-line @angular-eslint/use-injectable-provided-in
@Injectable()
export class AuditService extends AbstractEntityService<AuditEntry> {
	constructor() {
		super({
			[ServiceMethod.search]: 'api/audit'
		});
	}

	mapToType(model: unknown): AuditEntry {
		return new AuditEntry(model);
	}

	public getDistinctAuditValues(field: string): Observable<string[]> {
		return this.http.get<string[]>('api/audit/distinctValues', { params: { field } });
	}

	public matchUser(
		paging: PagingOptions,
		query: object = {},
		search = '',
		body?: object,
		options: object = {}
	): Observable<PagingResults<User>> {
		return this.http
			.post<PagingResults>(
				'api/users/match',
				{ q: query, s: search, options, ...body },
				{ params: paging.toObj() }
			)
			.pipe(
				map((pagingResults) => {
					return {
						...pagingResults,
						elements: pagingResults.elements.map((model) => new User(model))
					} as PagingResults<User>;
				})
			);
	}
}
