import { TestBed, getTestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { AuditService } from './audit.service';

import _cloneDeep from 'lodash/cloneDeep';
import { PagingOptions, PagingResults } from 'src/app/common/paging.module';
import { User } from '../auth/user.model';
import { SystemAlertService } from '../../common/system-alert.module';

describe('Audit Service', () => {
	let injector: TestBed;
	let service: AuditService;
	let httpMock: HttpTestingController;

	beforeEach(async () => {
		TestBed.configureTestingModule({
			imports: [HttpClientTestingModule],
			providers: [AuditService, SystemAlertService]
		});

		injector = getTestBed();
		service = injector.get(AuditService);
		httpMock = injector.get(HttpTestingController);
	});

	afterEach(() => {
		// Ensure there are no outstanding requests
		httpMock.verify();
	});

	describe('#getDistinctValues', () => {
		it('should call once and return an Observable<string[]>', () => {
			const values = ['value01', 'value 02'];
			service.getDistinctAuditValues('test-field').subscribe(actual => {
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
					{ id: '123', audit: {} },
					{ id: '456', audit: {} }
				]
			} as PagingResults;
			const paging = new PagingOptions();
			paging.setPageNumber(2);
			service.search({ actor: 'test' }, 'some-search', paging).subscribe(actual => {
				console.log(actual);
				expect(actual).toBe(results);
			});

			const req = httpMock.expectOne('api/audit?page=2&size=50&sort=null&dir=null');
			expect(req.request.method).toBe('POST');
			expect(req.request.body).toEqual({
				q: { actor: 'test' },
				s: 'some-search'
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
			expectedResults.elements = expectedResults.elements.map(element => {
				return new User().setFromUserModel(element);
			});
			const paging = new PagingOptions();
			paging.setPageNumber(2);
			const query = { actor: 'test' };
			const search = 'some-search';
			const options = { test: false };
			service.matchUser(query, search, paging, options).subscribe(actual => {
				expect(actual).toEqual(expectedResults);
			});

			const req = httpMock.expectOne('api/users/match?page=2&size=50&sort=null&dir=null');
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
