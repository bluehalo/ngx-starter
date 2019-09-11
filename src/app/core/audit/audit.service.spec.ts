import { TestBed, getTestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { AuditService } from './audit.service';

import _cloneDeep from 'lodash/cloneDeep';
import _pullAt from 'lodash/pullAt';
import { PagingOptions, PagingResults } from 'src/app/common/paging.module';
import { User } from '../auth/user.model';

describe('Audit Service', () => {

	let injector: TestBed;
	let service: AuditService;
	let httpMock: HttpTestingController;

	beforeEach(async () => {

		TestBed.configureTestingModule({
			imports: [HttpClientTestingModule],
			providers: [AuditService]
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
			const values = [
				'value01',
				'value 02'
			];
			service.getDistinctAuditValues('test-field').subscribe((actual) => {
				expect(actual).toBe(values);
			});

			const req = httpMock.expectOne('api/audit/distinctValues?field=test-field');
			expect(req.request.method).toBe('GET');
			req.flush(values);
		});

	});

	describe('#isViewDetailsAction', () => {

		it('should include defaults', () => {
			expect(service.isViewDetailsAction('create')).toBeTruthy();
			expect(service.isViewDetailsAction('delete')).toBeTruthy();
		});

		it('should allow for adding actions', () => {
			expect(service.isViewDetailsAction('new action')).toBeFalsy();
			service.addViewDetailsAction('new action');
			expect(service.isViewDetailsAction('new action')).toBeTruthy();
		});

	});

	describe('#isViewChangesAction', () => {

		it('should include defaults', () => {
			expect(service.isViewChangesAction('update')).toBeTruthy();
			expect(service.isViewChangesAction('admin update')).toBeTruthy();
		});

		it('should allow for adding actions', () => {
			expect(service.isViewChangesAction('new action')).toBeFalsy();
			service.addViewChangesAction('new action');
			expect(service.isViewChangesAction('new action')).toBeTruthy();
		});

	});

	describe('#search', () => {

		it('should call once and return an Observable<PagingResults>', () => {
			const results = {
				elements: [
					{ id: '123' },
					{ id: '456' }
				]
			} as PagingResults;
			const paging = new PagingOptions();
			paging.setPageNumber(2);
			service.search({ actor: 'test' }, 'some-search', paging).subscribe((actual) => {
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
			expectedResults.elements = expectedResults.elements.map((element) => {
				return new User().setFromUserModel(element);
			});
			const paging = new PagingOptions();
			paging.setPageNumber(2);
			const query = { actor: 'test' };
			const search = 'some-search';
			const options = { test: false };
			service.matchUser(query, search, paging, options).subscribe((actual) => {
				expect(actual).toEqual(expectedResults);
			});

			const req = httpMock.expectOne('api/users/match?page=2&size=50&sort=null&dir=null');
			expect(req.request.method).toBe('POST');
			expect(req.request.body).toEqual({
				q: query,
				s: search,
				options: options
			});
			req.flush(results);
		});

	});

});
