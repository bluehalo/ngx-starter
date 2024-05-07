import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';

import { of } from 'rxjs';

import { EndUserAgreement } from '../admin/end-user-agreement/eua.model';
import { provideSession } from '../provider';
import { APP_CONFIG } from '../tokens';
import { authGuard } from './auth.guard';
import { AuthenticationService } from './authentication.service';
import { Session } from './session.model';
import { SessionService } from './session.service';

import SpyObj = jasmine.SpyObj;

describe('AuthGuard', () => {
	let authServiceSpy: SpyObj<AuthenticationService>;

	const defaultConfig = {
		auth: 'local'
	};

	beforeEach(() => {
		authServiceSpy = jasmine.createSpyObj('AuthenticationService', [
			'reloadCurrentUser',
			'getCurrentEua'
		]);
		authServiceSpy.reloadCurrentUser.and.returnValue(of({}));
		authServiceSpy.getCurrentEua.and.returnValue(of(undefined));

		TestBed.configureTestingModule({
			providers: [
				{ provide: APP_CONFIG, useValue: signal(defaultConfig) },
				provideSession(),
				{ provide: AuthenticationService, useValue: authServiceSpy }
			]
		});
	});

	describe('canActivate', () => {
		it('should return true if authentication not required', (done) => {
			const route = {
				data: { requiresAuthentication: false }
			} as unknown as ActivatedRouteSnapshot;

			TestBed.runInInjectionContext(() => {
				authGuard()(route, {} as RouterStateSnapshot).subscribe((result) => {
					expect(result).toBe(true);
					done();
				});
			});
		});

		it('should redirect to login for unauthenticated user', (done) => {
			const route = {} as unknown as ActivatedRouteSnapshot;

			const sessionService: SessionService = TestBed.inject(SessionService);
			spyOn(sessionService, 'getSession').and.returnValue(of({} as Session));

			TestBed.runInInjectionContext(() => {
				authGuard()(route, {} as RouterStateSnapshot).subscribe((result) => {
					expect(result instanceof UrlTree).toBe(true);
					expect(result.toString()).toBe('/signin');
					done();
				});
			});
		});

		it('should redirect to /unauthorized for authenticated user without user role', (done) => {
			authServiceSpy.reloadCurrentUser.and.returnValue(
				of({
					name: 'test',
					username: 'test'
				})
			);

			const route = {} as unknown as ActivatedRouteSnapshot;

			TestBed.runInInjectionContext(() => {
				authGuard()(route, {} as RouterStateSnapshot).subscribe((result) => {
					expect(result instanceof UrlTree).toBe(true);
					expect(result.toString()).toBe('/unauthorized');
					done();
				});
			});
		});

		it('should return true for authenticated user w/ user role', (done) => {
			authServiceSpy.reloadCurrentUser.and.returnValue(
				of({
					name: 'test',
					username: 'test',
					roles: { user: true }
				})
			);

			const route = {} as unknown as ActivatedRouteSnapshot;

			TestBed.runInInjectionContext(() => {
				authGuard()(route, {} as RouterStateSnapshot).subscribe((result) => {
					expect(result).toBe(true);
					done();
				});
			});
		});

		it('should redirect to /unauthorized for authenticated user without required roles', (done) => {
			authServiceSpy.reloadCurrentUser.and.returnValue(
				of({
					name: 'test',
					username: 'test',
					roles: { user: true }
				})
			);

			const route = {
				data: { roles: ['admin'] }
			} as unknown as ActivatedRouteSnapshot;

			TestBed.runInInjectionContext(() => {
				authGuard()(route, {} as RouterStateSnapshot).subscribe((result) => {
					expect(result instanceof UrlTree).toBe(true);
					expect(result.toString()).toBe('/unauthorized');
					done();
				});
			});
		});

		it('should redirect to /unauthorized for authenticated user with none of the required roles', (done) => {
			authServiceSpy.reloadCurrentUser.and.returnValue(
				of({
					name: 'test',
					username: 'test',
					roles: { user: true }
				})
			);

			const route = {
				data: { roles: ['test', 'admin'], requireAllRoles: false }
			} as unknown as ActivatedRouteSnapshot;

			TestBed.runInInjectionContext(() => {
				authGuard()(route, {} as RouterStateSnapshot).subscribe((result) => {
					expect(result instanceof UrlTree).toBe(true);
					expect(result.toString()).toBe('/unauthorized');
					done();
				});
			});
		});

		it('should return true for authenticated user with some of the required roles', (done) => {
			authServiceSpy.reloadCurrentUser.and.returnValue(
				of({
					name: 'test',
					username: 'test',
					roles: { user: true }
				})
			);

			const route = {
				data: { roles: ['user', 'admin'], requireAllRoles: false }
			} as unknown as ActivatedRouteSnapshot;

			TestBed.runInInjectionContext(() => {
				authGuard()(route, {} as RouterStateSnapshot).subscribe((result) => {
					expect(result).toBe(true);
					done();
				});
			});
		});

		it('should return true for authenticated user with all of the required roles', (done) => {
			authServiceSpy.reloadCurrentUser.and.returnValue(
				of({
					name: 'test',
					username: 'test',
					roles: { user: true, admin: true }
				})
			);

			const route = {
				data: { roles: ['user', 'admin'], requireAllRoles: true }
			} as unknown as ActivatedRouteSnapshot;

			TestBed.runInInjectionContext(() => {
				authGuard()(route, {} as RouterStateSnapshot).subscribe((result) => {
					expect(result).toBe(true);
					done();
				});
			});
		});

		it('should redirect to /eua for authenticated user who has not accepted latest eua', (done) => {
			authServiceSpy.reloadCurrentUser.and.returnValue(
				of({
					name: 'test',
					username: 'test',
					roles: { user: true }
				})
			);
			authServiceSpy.getCurrentEua.and.returnValue(
				of(new EndUserAgreement({ published: 1 }))
			);

			const route = { data: { requiresEua: true } } as unknown as ActivatedRouteSnapshot;

			TestBed.runInInjectionContext(() => {
				authGuard()(route, {} as RouterStateSnapshot).subscribe((result) => {
					expect(result instanceof UrlTree).toBe(true);
					expect(result.toString()).toBe('/eua');
					done();
				});
			});
		});
	});
});
