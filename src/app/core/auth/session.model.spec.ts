import { Role } from './role.model';
import { Session } from './session.model';

describe('Session', () => {
	const EMPTY_SESSION = new Session();
	const USER_SESSION = new Session({
		name: 'test',
		roles: {
			user: true,
			admin: false
		},
		externalRoles: ['ROLE1']
	});
	const ADMIN_SESSION = new Session({
		name: 'test',
		roles: {
			user: true,
			admin: true
		},
		externalRoles: ['ROLE1', 'ROLE2']
	});
	const INACTIVE_USER_SESSION = new Session({
		name: 'test',
		roles: {
			user: false,
			admin: false
		},
		externalRoles: ['ROLE1']
	});

	describe('isAuthenticated', () => {
		it('should return false when session is null', () => {
			expect(EMPTY_SESSION.isAuthenticated()).toBeFalsy();
		});

		it('should return true when session is valid and user has "user" role', () => {
			expect(USER_SESSION.isAuthenticated()).toBeTruthy();
		});
	});

	describe('hasExternalRole', () => {
		it('should return false when session is null', () => {
			expect(EMPTY_SESSION.hasExternalRole('ROLE1')).toBeFalsy();
		});

		it('should return false when session is valid and does not have the external role', () => {
			expect(USER_SESSION.hasExternalRole('ROLE2')).toBeFalsy();
		});

		it('should return true when session is valid and user has the external role', () => {
			expect(USER_SESSION.hasExternalRole('ROLE1')).toBeTruthy();
		});
	});

	describe('hasRole', () => {
		it('should return false when session is null', () => {
			expect(EMPTY_SESSION.hasRole('user')).toBeFalsy();
		});

		it('should return false when session is valid and user does not have the "user" role', () => {
			expect(EMPTY_SESSION.hasRole('user')).toBeFalsy();
		});

		it('should return true when session is valid and user has the "user" role', () => {
			expect(USER_SESSION.hasRole('user')).toBeTruthy();
		});
	});

	describe('hasEveryRole', () => {
		it('should return false when session is null', () => {
			expect(EMPTY_SESSION.hasEveryRole([Role.USER])).toBeFalsy();
		});

		it('should return false when session is missing at least one role', () => {
			expect(USER_SESSION.hasEveryRole([Role.USER, Role.ADMIN])).toBeFalsy();
		});

		it('should return true when session has every role', () => {
			expect(ADMIN_SESSION.hasEveryRole([Role.USER, Role.ADMIN])).toBeTruthy();
		});
	});

	describe('hasSomeRoles', () => {
		it('should return false when session is null', () => {
			expect(EMPTY_SESSION.hasSomeRoles([Role.USER])).toBeFalsy();
		});

		it('should return false when session is missing all roles', () => {
			expect(USER_SESSION.hasSomeRoles([Role.AUDITOR, Role.EDITOR])).toBeFalsy();
		});

		it('should return true when session has at least one role', () => {
			expect(USER_SESSION.hasSomeRoles([Role.USER, Role.ADMIN])).toBeTruthy();
			expect(ADMIN_SESSION.hasSomeRoles([Role.USER, Role.ADMIN])).toBeTruthy();
		});
	});

	describe('isAdmin', () => {
		it('should return false when session is null', () => {
			expect(EMPTY_SESSION.isAdmin()).toBeFalsy();
		});

		it('should return false for user session', () => {
			expect(USER_SESSION.isAdmin()).toBeFalsy();
		});

		it('should return true for admin session', () => {
			expect(ADMIN_SESSION.isAdmin()).toBeTruthy();
		});
	});

	describe('isUser', () => {
		it('should return false when session is null', () => {
			expect(EMPTY_SESSION.isUser()).toBeFalsy();
		});

		it('should return false for session without user role', () => {
			expect(INACTIVE_USER_SESSION.isUser()).toBeFalsy();
		});

		it('should return true for session with user role', () => {
			expect(USER_SESSION.isUser()).toBeTruthy();
			expect(ADMIN_SESSION.isUser()).toBeTruthy();
		});
	});
});
