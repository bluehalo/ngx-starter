import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';

import { of } from 'rxjs';

import { Config } from '../config.model';
import { ConfigService } from '../config.service';
import { AuthGuard } from './auth.guard';
import { AuthenticationService } from './authentication.service';
import { AuthorizationService } from './authorization.service';
import { Session } from './session.model';
import { SessionService } from './session.service';

import SpyObj = jasmine.SpyObj;

describe('AuthGuard', () => {
	let guard: AuthGuard;
	let router: Router;
	let sessionService: SessionService;

	let configServiceSpy: SpyObj<ConfigService>;
	let authServiceSpy: SpyObj<AuthenticationService>;

	const defaultConfig = {
		auth: 'local'
	};

	beforeEach(() => {
		configServiceSpy = jasmine.createSpyObj('ConfigService', ['getConfig']);
		configServiceSpy.getConfig.and.returnValue(of(defaultConfig as Config));

		authServiceSpy = jasmine.createSpyObj('AuthenticationService', [
			'reloadCurrentUser',
			'getCurrentEua'
		]);
		authServiceSpy.reloadCurrentUser.and.returnValue(of({}));
		authServiceSpy.getCurrentEua.and.returnValue(of(null));

		TestBed.configureTestingModule({
			providers: [
				{ provide: ConfigService, useValue: configServiceSpy },
				{ provide: AuthenticationService, useValue: authServiceSpy },
				{ provide: SessionService },
				{ provide: AuthorizationService },
				{ provide: AuthGuard }
			]
		});
		guard = TestBed.inject(AuthGuard);
		router = TestBed.inject(Router);
		sessionService = TestBed.inject(SessionService);
	});

	it('should be created', () => {
		expect(guard).toBeTruthy();
	});

	describe('canActivate', () => {
		it('should return true if authentication not required', (done) => {
			const route = {
				data: { requiresAuthentication: false }
			} as unknown as ActivatedRouteSnapshot;

			guard.canActivate(route, {} as RouterStateSnapshot).subscribe((result) => {
				expect(result).toBe(true);
				done();
			});
		});

		it('should redirect to login for unauthenticated user', (done) => {
			const route = {} as unknown as ActivatedRouteSnapshot;

			spyOn(sessionService, 'getSession').and.returnValue(of({} as Session));

			guard.canActivate(route, {} as RouterStateSnapshot).subscribe((result) => {
				expect(result instanceof UrlTree).toBe(true);
				expect(result.toString()).toBe('/signin');
				done();
			});
		});

		it('should return false for authenticated user without user role', (done) => {
			authServiceSpy.reloadCurrentUser.and.returnValue(
				of({
					name: 'test',
					username: 'test'
				})
			);

			const route = {} as unknown as ActivatedRouteSnapshot;

			guard.canActivate(route, {} as RouterStateSnapshot).subscribe((result) => {
				expect(result instanceof UrlTree).toBe(true);
				expect(result.toString()).toBe('/unauthorized');
				done();
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

			guard.canActivate(route, {} as RouterStateSnapshot).subscribe((result) => {
				expect(result).toBe(true);
				done();
			});
		});

		it('should return false for authenticated user without required roles', (done) => {
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

			guard.canActivate(route, {} as RouterStateSnapshot).subscribe((result) => {
				expect(result instanceof UrlTree).toBe(true);
				expect(result.toString()).toBe('/unauthorized');
				done();
			});
		});

		it('should return false for authenticated user with none of the required roles', (done) => {
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

			guard.canActivate(route, {} as RouterStateSnapshot).subscribe((result) => {
				expect(result instanceof UrlTree).toBe(true);
				expect(result.toString()).toBe('/unauthorized');
				done();
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

			guard.canActivate(route, {} as RouterStateSnapshot).subscribe((result) => {
				expect(result).toBe(true);
				done();
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

			guard.canActivate(route, {} as RouterStateSnapshot).subscribe((result) => {
				expect(result).toBe(true);
				done();
			});
		});

		it('should redirect to eua page for authenticated user who has not accepted latest eua', (done) => {
			authServiceSpy.reloadCurrentUser.and.returnValue(
				of({
					name: 'test',
					username: 'test',
					roles: { user: true }
				})
			);
			authServiceSpy.getCurrentEua.and.returnValue(of({ published: 1 }));

			const route = { data: { requiresEua: true } } as unknown as ActivatedRouteSnapshot;

			guard.canActivate(route, {} as RouterStateSnapshot).subscribe((result) => {
				expect(result instanceof UrlTree).toBe(true);
				expect(result.toString()).toBe('/eua');
				done();
			});
		});
	});
});
