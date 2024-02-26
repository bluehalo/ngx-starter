import { HttpErrorResponse } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Injectable } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { AbstractEntityService, ServiceMethod } from './abstract-entity.service';
import { PagingOptions } from './paging.model';
import { SystemAlertService } from './system-alert/system-alert.service';

@Injectable({
	providedIn: 'root'
})
class TestEntityService extends AbstractEntityService<any> {
	constructor() {
		super({
			[ServiceMethod.create]: 'api/test',
			[ServiceMethod.read]: 'api/test',
			[ServiceMethod.update]: 'api/test',
			[ServiceMethod.delete]: 'api/test',
			[ServiceMethod.search]: 'api/tests'
		});
	}

	mapToType(model: any): any {
		return model;
	}
}

describe('AbstractEntityService', () => {
	let service: TestEntityService;
	let httpTestingController: HttpTestingController;
	let alertServiceSpy: jasmine.SpyObj<SystemAlertService>;

	beforeEach(() => {
		const spy = jasmine.createSpyObj('SystemAlertService', ['addAlert', 'addClientErrorAlert']);

		TestBed.configureTestingModule({
			imports: [HttpClientTestingModule],
			providers: [{ provide: SystemAlertService, useValue: spy }]
		});

		service = TestBed.inject(TestEntityService);
		alertServiceSpy = TestBed.inject(SystemAlertService) as jasmine.SpyObj<SystemAlertService>;
		httpTestingController = TestBed.inject(HttpTestingController);
	});

	afterEach(() => {
		httpTestingController.verify();
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});

	describe('getMethodUrl', () => {
		it('should throw error for invalid method', () => {
			expect(() => {
				service.getMethodUrl('test');
			}).toThrowError("Method 'test' is not supported.");
		});

		it('should return proper url method', () => {
			expect(service.getMethodUrl(ServiceMethod.create)).toEqual('api/test');
			expect(service.getMethodUrl(ServiceMethod.read, '12345')).toEqual('api/test/12345');
			expect(service.getMethodUrl(ServiceMethod.update, { _id: '12345' })).toEqual(
				'api/test/12345'
			);
			expect(service.getMethodUrl(ServiceMethod.search)).toEqual('api/tests');
		});
	});

	describe('create', () => {
		const testData: any = { name: 'value' };

		it('should return created object', () => {
			service.create(testData).subscribe((data) => {
				expect(data).toBeDefined();
				Object.keys(testData).forEach((key) => {
					expect(data[key]).toEqual(testData[key]);
				});
			});

			const req = httpTestingController.expectOne('api/test');
			expect(req.request.method).toEqual('POST');

			req.flush({ ...testData, created: new Date().toISOString() });

			httpTestingController.verify();
		});

		it('should return null', () => {
			const handleErrorSpy = spyOn(service, 'handleError').and.callThrough();

			service.create(testData).subscribe((data) => {
				expect(data).toBeNull();
			});

			const req = httpTestingController.expectOne('api/test');
			expect(req.request.method).toEqual('POST');

			req.flush('error', { status: 404, statusText: 'error' });

			expect(handleErrorSpy.calls.count()).toBe(1);

			httpTestingController.verify();
		});
	});

	describe('read', () => {
		const testData: any = { _id: '12345' };

		it('should return object', () => {
			service.read(testData._id).subscribe((data) => {
				expect(data).toBeDefined();
				Object.keys(testData).forEach((key) => {
					expect(data[key]).toEqual(testData[key]);
				});
			});

			const req = httpTestingController.expectOne('api/test/12345');
			expect(req.request.method).toEqual('GET');

			req.flush({ ...testData, created: new Date().toISOString() });

			httpTestingController.verify();
		});
	});

	describe('update', () => {
		const testData: any = { _id: '12345', field: 'value' };

		it('should return object', () => {
			service.update(testData).subscribe((data) => {
				expect(data).toBeDefined();
				Object.keys(testData).forEach((key) => {
					expect(data[key]).toEqual(testData[key]);
				});
			});

			const req = httpTestingController.expectOne('api/test/12345');
			expect(req.request.method).toEqual('POST');

			req.flush({ ...testData, created: new Date().toISOString() });

			httpTestingController.verify();
		});

		it('should return null', () => {
			const handleErrorSpy = spyOn(service, 'handleError').and.callThrough();

			service.update(testData).subscribe((data) => {
				expect(data).toBeNull();
			});

			const req = httpTestingController.expectOne('api/test/12345');
			expect(req.request.method).toEqual('POST');

			req.flush('error', { status: 404, statusText: 'error' });

			expect(handleErrorSpy.calls.count()).toBe(1);

			httpTestingController.verify();
		});
	});

	describe('delete', () => {
		const testData: any = { _id: '12345', field: 'value' };

		it('should return object', () => {
			service.delete(testData).subscribe((data) => {
				expect(data).toBeDefined();
				Object.keys(testData).forEach((key) => {
					expect(data[key]).toEqual(testData[key]);
				});
			});

			const req = httpTestingController.expectOne('api/test/12345');
			expect(req.request.method).toEqual('DELETE');

			req.flush({ ...testData, created: new Date().toISOString() });

			httpTestingController.verify();
		});

		it('should return null', () => {
			const handleErrorSpy = spyOn(service, 'handleError').and.callThrough();

			service.delete(testData).subscribe((data) => {
				expect(data).toBeNull();
			});

			const req = httpTestingController.expectOne('api/test/12345');
			expect(req.request.method).toEqual('DELETE');

			req.flush('error', { status: 404, statusText: 'error' });

			expect(handleErrorSpy.calls.count()).toBe(1);

			httpTestingController.verify();
		});
	});

	describe('search', () => {
		const paging = new PagingOptions();

		it('should return results', () => {
			service.search(paging).subscribe((data) => {
				expect(data).toBeDefined();
				expect(data).toEqual({
					pageNumber: 0,
					pageSize: 50,
					totalPages: 0,
					totalSize: 0,
					elements: [{ value: '1' }, { value: '2' }]
				});
			});

			const req = httpTestingController.expectOne('api/tests?page=0&size=50');
			expect(req.request.method).toEqual('POST');

			req.flush({
				pageNumber: 0,
				pageSize: 50,
				totalPages: 0,
				totalSize: 0,
				elements: [{ value: '1' }, { value: '2' }]
			});

			httpTestingController.verify();
		});

		it('should override url', () => {
			service
				.search(paging, {}, '', null, null, {}, 'api/tests/override')
				.subscribe((data) => {
					expect(data).toBeDefined();
					expect(data).toEqual({
						pageNumber: 0,
						pageSize: 50,
						totalPages: 0,
						totalSize: 0,
						elements: [{ value: '1' }, { value: '2' }]
					});
				});

			const req = httpTestingController.expectOne('api/tests/override?page=0&size=50');
			expect(req.request.method).toEqual('POST');

			req.flush({
				pageNumber: 0,
				pageSize: 50,
				totalPages: 0,
				totalSize: 0,
				elements: [{ value: '1' }, { value: '2' }]
			});

			httpTestingController.verify();
		});

		it('should return empty array', () => {
			const handleErrorSpy = spyOn(service, 'handleError').and.callThrough();

			service.search(paging).subscribe((data) => {
				// expect(data).toEqual({ pageNumber: 0, pageSize: 50, totalPages: 0 });
			});

			const req = httpTestingController.expectOne('api/tests?page=0&size=50');
			expect(req.request.method).toEqual('POST');

			req.flush('error', { status: 404, statusText: 'error' });

			expect(handleErrorSpy.calls.count()).toBe(1);

			httpTestingController.verify();
		});
	});

	describe('updateAction', () => {
		const testData: any = { _id: '12345', field: 'value' };

		it('should return object', () => {
			service.updateAction('action', testData).subscribe((data) => {
				expect(data).toBeDefined();
				Object.keys(testData).forEach((key) => {
					expect(data[key]).toEqual(testData[key]);
				});
			});

			const req = httpTestingController.expectOne('api/test/12345/action');
			expect(req.request.method).toEqual('POST');

			req.flush({ ...testData, created: new Date().toISOString() });

			httpTestingController.verify();
		});

		it('should return null', () => {
			const handleErrorSpy = spyOn(service, 'handleError').and.callThrough();

			service.updateAction('action', testData).subscribe((data) => {
				expect(data).toBeNull();
			});

			const req = httpTestingController.expectOne('api/test/12345/action');
			expect(req.request.method).toEqual('POST');

			req.flush('error', { status: 404, statusText: 'error' });

			expect(handleErrorSpy.calls.count()).toBe(1);

			httpTestingController.verify();
		});
	});

	describe('handleError', () => {
		it('should handle http error', () => {
			const error = new HttpErrorResponse({
				error: 'error text',
				status: 404,
				statusText: 'status text'
			});
			service.handleError(error, null);

			expect(alertServiceSpy.addAlert.calls.count())
				.withContext('addAlert was not called')
				.toBe(0);

			expect(alertServiceSpy.addClientErrorAlert.calls.count())
				.withContext('addClientErrorAlert was not called')
				.toBe(1);

			const httpError = alertServiceSpy.addClientErrorAlert.calls.mostRecent().args[0];
			expect(httpError).toBeDefined();
			expect(httpError.error).toBe('error text');
			expect(httpError.status).toBe(404);
			expect(httpError.statusText).toBe('status text');
		});

		it('should handle validation error', () => {
			const tests = [
				{
					error: { errors: {} },
					expectedMsg: 'Validation Error'
				},
				{
					error: {
						errors: { body: [{ dataPath: '/data/path', message: 'is required' }] }
					},
					expectedMsg: 'Validation Error: data/path is required'
				},
				{
					error: {
						errors: { query: [{ dataPath: '/data/path', message: 'is required' }] }
					},
					expectedMsg: 'Validation Error: data/path is required'
				}
			];

			tests.forEach((test) => {
				const error = new HttpErrorResponse({
					error: test.error,
					status: 400,
					statusText: 'validation error'
				});
				service.handleError(error, null);

				expect(alertServiceSpy.addAlert.calls.count())
					.withContext('addAlert was not called')
					.toBe(1);

				expect(alertServiceSpy.addClientErrorAlert.calls.count())
					.withContext('addClientErrorAlert was not called')
					.toBe(0);

				const alertMsg = alertServiceSpy.addAlert.calls.mostRecent().args[0];
				expect(alertMsg).toBe(test.expectedMsg);

				alertServiceSpy.addAlert.calls.reset();
			});
		});
	});
});
