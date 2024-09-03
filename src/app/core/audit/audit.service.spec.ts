import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed, getTestBed } from '@angular/core/testing';

import _cloneDeep from 'lodash/cloneDeep';

import { PagingOptions, PagingResults } from '../../common';
import { SystemAlertService } from '../../common/system-alert';
import { User } from '../auth';
import { AuditEntry } from './audit-entry.model';
import { AuditService } from './audit.service';

describe('Audit Service', () => {
	let injector: TestBed;
	let service: AuditService;
	let httpMock: HttpTestingController;

	beforeEach(async () => {
		TestBed.configureTestingModule({
			imports: [],
			providers: [
				AuditService,
				SystemAlertService,
				provideHttpClient(withInterceptorsFromDi()),
				provideHttpClientTesting()
			]
		});

		injector = getTestBed();
		service = injector.inject(AuditService);
		httpMock = injector.inject(HttpTestingController);
	});

	afterEach(() => {
		// Ensure there are no outstanding requests
		httpMock.verify();
	});

	describe('#getDistinctValues', () => {
		it('should call once and return an Observable<string[]>', () => {
			const values = ['value01', 'value 02'];
			service.getDistinctAuditValues('test-field').subscribe((actual) => {
				expect(actual).toBe(values);
			});

			const req = httpMock.expectOne('api/audit/distinctValues?field=test-field');
			expect(req.request.method).toBe('GET');
			req.flush(values);
		});
	});

	describe('#search', () => {
		it('should call once and return an Observable<PagingResults>', () => {
			const results = {
				elements: [
					new AuditEntry({ id: '123', audit: {} }),
					new AuditEntry({ id: '456', audit: {} })
				]
			} as PagingResults<AuditEntry>;
			const paging = new PagingOptions();
			paging.setPageNumber(2);
			service.search(paging, { actor: 'test' }, 'some-search').subscribe((actual) => {
				expect(actual).toEqual(results);
			});

			const req = httpMock.expectOne('api/audit?page=2&size=50');
			expect(req.request.method).toBe('POST');
			expect(req.request.body).toEqual({
				q: { actor: 'test' },
				s: 'some-search',
				options: {}
			});
			req.flush(results);
		});
	});

	describe('#matchUser', () => {
		it('should call once and return an Observable<PagingResults>', () => {
			const results = {
				elements: [
					{ id: '123', username: 'test01' },
					{ id: '456', username: 'test02' }
				]
			} as PagingResults;
			const expectedResults = _cloneDeep(results);
			expectedResults.elements = expectedResults.elements.map((element) => {
				return new User(element);
			});
			const paging = new PagingOptions();
			paging.setPageNumber(2);
			const query = { actor: 'test' };
			const search = 'some-search';
			const options = { test: false };
			service.matchUser(paging, query, search, undefined, options).subscribe((actual) => {
				expect(actual).toEqual(expectedResults as PagingResults<User>);
			});

			const req = httpMock.expectOne('api/users/match?page=2&size=50');
			expect(req.request.method).toBe('POST');
			expect(req.request.body).toEqual({
				q: query,
				s: search,
				options
			});
			req.flush(results);
		});
	});
});
