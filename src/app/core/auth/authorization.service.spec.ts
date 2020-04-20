import { inject, TestBed } from '@angular/core/testing';

import { BehaviorSubject, Observable } from 'rxjs/index';
import { AuthorizationService } from './authorization.service';
import { Role } from './role.model';
import { Session } from './session.model';
import { SessionService } from './session.service';

class MockSessionService {
	sessionSubject = new BehaviorSubject<Session>(null);

	getSession(): Observable<Session> {
		return this.sessionSubject;
	}
}

describe('AuthorizationService', () => {
	let localService: AuthorizationService;
	let sessionService: SessionService;

	const EMPTY_SESSION: Session = null;
	const USER_SESSION: any = {
		name: 'test',
		user: {
			userModel: {
				roles: {
					user: true,
					admin: false
				},
				externalRoles: ['ROLE1']
			}
		}
	};
	const ADMIN_SESSION: any = {
		name: 'test',
		user: {
			userModel: {
				roles: {
					user: true,
					admin: true
				},
				externalRoles: ['ROLE1', 'ROLE2']
			}
		}
	};
	const INACTIVE_USER_SESSION: any = {
		name: 'test',
		user: {
			userModel: {
				roles: {
					user: false,
					admin: false
				},
				externalRoles: ['ROLE1']
			}
		}
	};

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [
				AuthorizationService,
				{ provide: SessionService, useClass: MockSessionService }
			]
		});
	});

	beforeEach(inject(
		[AuthorizationService, SessionService],
		(service: AuthorizationService, session: SessionService) => {
			localService = service;
			sessionService = session;
		}
	));

	it('should create an instance', () => {
		expect(localService).toBeTruthy();
	});

	describe('isAuthenticated', () => {
		it('should return false when session is null', () => {
			sessionService.sessionSubject.next(EMPTY_SESSION);
			expect(localService.isAuthenticated()).toBeFalsy();
		});

		it('should return true when session is valid and user has "user" role', () => {
			sessionService.sessionSubject.next(USER_SESSION);
			expect(localService.isAuthenticated()).toBeTruthy();
		});
	});

	describe('hasExternalRole', () => {
		it('should return false when session is null', () => {
			sessionService.sessionSubject.next(EMPTY_SESSION);
			expect(localService.hasExternalRole('ROLE1')).toBeFalsy();
		});

		it('should return false when session is valid and does not have the external role', () => {
			sessionService.sessionSubject.next(USER_SESSION);
			expect(localService.hasExternalRole('ROLE2')).toBeFalsy();
		});

		it('should return true when session is valid and user has the external role', () => {
			sessionService.sessionSubject.next(USER_SESSION);
			expect(localService.hasExternalRole('ROLE1')).toBeTruthy();
		});
	});

	describe('hasRole', () => {
		it('should return false when session is null', () => {
			sessionService.sessionSubject.next(EMPTY_SESSION);
			expect(localService.hasRole('user')).toBeFalsy();
		});

		it('should return false when session is valid and user does not have the "user" role', () => {
			sessionService.sessionSubject.next(EMPTY_SESSION);
			expect(localService.hasRole('user')).toBeFalsy();
		});

		it('should return true when session is valid and user has the "user" role', () => {
			sessionService.sessionSubject.next(USER_SESSION);
			expect(localService.hasRole('user')).toBeTruthy();
		});
	});

	describe('hasEveryRole', () => {
		it('should return false when session is null', () => {
			sessionService.sessionSubject.next(EMPTY_SESSION);
			expect(localService.hasEveryRole([Role.USER])).toBeFalsy();
		});

		it('should return false when session is missing at least one role', () => {
			sessionService.sessionSubject.next(USER_SESSION);
			expect(localService.hasEveryRole([Role.USER, Role.ADMIN])).toBeFalsy();
		});

		it('should return true when session has every role', () => {
			sessionService.sessionSubject.next(ADMIN_SESSION);
			expect(localService.hasEveryRole([Role.USER, Role.ADMIN])).toBeTruthy();
		});
	});

	describe('hasSomeRoles', () => {
		it('should return false when session is null', () => {
			sessionService.sessionSubject.next(EMPTY_SESSION);
			expect(localService.hasSomeRoles([Role.USER])).toBeFalsy();
		});

		it('should return false when session is missing all roles', () => {
			sessionService.sessionSubject.next(USER_SESSION);
			expect(localService.hasSomeRoles([Role.AUDITOR, Role.EDITOR])).toBeFalsy();
		});

		it('should return true when session has at least one role', () => {
			sessionService.sessionSubject.next(USER_SESSION);
			expect(localService.hasSomeRoles([Role.USER, Role.ADMIN])).toBeTruthy();
			sessionService.sessionSubject.next(ADMIN_SESSION);
			expect(localService.hasSomeRoles([Role.USER, Role.ADMIN])).toBeTruthy();
		});
	});

	describe('isAdmin', () => {
		it('should return false when session is null', () => {
			sessionService.sessionSubject.next(EMPTY_SESSION);
			expect(localService.isAdmin()).toBeFalsy();
		});

		it('should return false for user session', () => {
			sessionService.sessionSubject.next(USER_SESSION);
			expect(localService.isAdmin()).toBeFalsy();
		});

		it('should return true for admin session', () => {
			sessionService.sessionSubject.next(ADMIN_SESSION);
			expect(localService.isAdmin()).toBeTruthy();
		});
	});

	describe('isUser', () => {
		it('should return false when session is null', () => {
			sessionService.sessionSubject.next(EMPTY_SESSION);
			expect(localService.isUser()).toBeFalsy();
		});

		it('should return false for session without user role', () => {
			sessionService.sessionSubject.next(INACTIVE_USER_SESSION);
			expect(localService.isUser()).toBeFalsy();
		});

		it('should return true for session with user role', () => {
			sessionService.sessionSubject.next(USER_SESSION);
			expect(localService.isUser()).toBeTruthy();
			sessionService.sessionSubject.next(ADMIN_SESSION);
			expect(localService.isUser()).toBeTruthy();
		});
	});
});
