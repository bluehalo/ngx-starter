import { signal } from '@angular/core';
import { TestBed, inject } from '@angular/core/testing';

import { APP_SESSION } from '../tokens';
import { AuthorizationService } from './authorization.service';
import { Role } from './role.model';
import { Session } from './session.model';
import { User } from './user.model';

/* eslint-disable deprecation/deprecation */
describe('AuthorizationService', () => {
	let localService: AuthorizationService;
	const sessionSignal = signal<Session>(new Session());

	const EMPTY_SESSION = new Session();
	const USER_SESSION = new Session(
		new User({
			name: 'test',
			roles: {
				user: true,
				admin: false
			},
			externalRoles: ['ROLE1']
		})
	);
	const ADMIN_SESSION = new Session(
		new User({
			name: 'test',
			roles: {
				user: true,
				admin: true
			},
			externalRoles: ['ROLE1', 'ROLE2']
		})
	);
	const INACTIVE_USER_SESSION = new Session(
		new User({
			name: 'test',
			roles: {
				user: false,
				admin: false
			},
			externalRoles: ['ROLE1']
		})
	);

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [AuthorizationService, { provide: APP_SESSION, useValue: sessionSignal }]
		});
	});

	beforeEach(inject([AuthorizationService], (service: AuthorizationService) => {
		localService = service;
	}));

	it('should create an instance', () => {
		expect(localService).toBeTruthy();
	});

	describe('isAuthenticated', () => {
		it('should return false when session is null', () => {
			sessionSignal.set(EMPTY_SESSION);
			expect(localService.isAuthenticated()).toBeFalsy();
		});

		it('should return true when session is valid and user has "user" role', () => {
			sessionSignal.set(USER_SESSION);
			expect(localService.isAuthenticated()).toBeTruthy();
		});
	});

	describe('hasExternalRole', () => {
		it('should return false when session is null', () => {
			sessionSignal.set(EMPTY_SESSION);
			expect(localService.hasExternalRole('ROLE1')).toBeFalsy();
		});

		it('should return false when session is valid and does not have the external role', () => {
			sessionSignal.set(USER_SESSION);
			expect(localService.hasExternalRole('ROLE2')).toBeFalsy();
		});

		it('should return true when session is valid and user has the external role', () => {
			sessionSignal.set(USER_SESSION);
			expect(localService.hasExternalRole('ROLE1')).toBeTruthy();
		});
	});

	describe('hasRole', () => {
		it('should return false when session is null', () => {
			sessionSignal.set(EMPTY_SESSION);
			expect(localService.hasRole('user')).toBeFalsy();
		});

		it('should return false when session is valid and user does not have the "user" role', () => {
			sessionSignal.set(EMPTY_SESSION);
			expect(localService.hasRole('user')).toBeFalsy();
		});

		it('should return true when session is valid and user has the "user" role', () => {
			sessionSignal.set(USER_SESSION);
			expect(localService.hasRole('user')).toBeTruthy();
		});
	});

	describe('hasEveryRole', () => {
		it('should return false when session is null', () => {
			sessionSignal.set(EMPTY_SESSION);
			expect(localService.hasEveryRole([Role.USER])).toBeFalsy();
		});

		it('should return false when session is missing at least one role', () => {
			sessionSignal.set(USER_SESSION);
			expect(localService.hasEveryRole([Role.USER, Role.ADMIN])).toBeFalsy();
		});

		it('should return true when session has every role', () => {
			sessionSignal.set(ADMIN_SESSION);
			expect(localService.hasEveryRole([Role.USER, Role.ADMIN])).toBeTruthy();
		});
	});

	describe('hasSomeRoles', () => {
		it('should return false when session is null', () => {
			sessionSignal.set(EMPTY_SESSION);
			expect(localService.hasSomeRoles([Role.USER])).toBeFalsy();
		});

		it('should return false when session is missing all roles', () => {
			sessionSignal.set(USER_SESSION);
			expect(localService.hasSomeRoles([Role.AUDITOR, Role.EDITOR])).toBeFalsy();
		});

		it('should return true when session has at least one role', () => {
			sessionSignal.set(USER_SESSION);
			expect(localService.hasSomeRoles([Role.USER, Role.ADMIN])).toBeTruthy();
			sessionSignal.set(ADMIN_SESSION);
			expect(localService.hasSomeRoles([Role.USER, Role.ADMIN])).toBeTruthy();
		});
	});

	describe('isAdmin', () => {
		it('should return false when session is null', () => {
			sessionSignal.set(EMPTY_SESSION);
			expect(localService.isAdmin()).toBeFalsy();
		});

		it('should return false for user session', () => {
			sessionSignal.set(USER_SESSION);
			expect(localService.isAdmin()).toBeFalsy();
		});

		it('should return true for admin session', () => {
			sessionSignal.set(ADMIN_SESSION);
			expect(localService.isAdmin()).toBeTruthy();
		});
	});

	describe('isUser', () => {
		it('should return false when session is null', () => {
			sessionSignal.set(EMPTY_SESSION);
			expect(localService.isUser()).toBeFalsy();
		});

		it('should return false for session without user role', () => {
			sessionSignal.set(INACTIVE_USER_SESSION);
			expect(localService.isUser()).toBeFalsy();
		});

		it('should return true for session with user role', () => {
			sessionSignal.set(USER_SESSION);
			expect(localService.isUser()).toBeTruthy();
			sessionSignal.set(ADMIN_SESSION);
			expect(localService.isUser()).toBeTruthy();
		});
	});
});

/* eslint-enable deprecation/deprecation */
