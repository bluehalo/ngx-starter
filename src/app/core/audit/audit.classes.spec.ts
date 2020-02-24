import { AuditActionTypes } from './audit.classes';

describe('Audit Classes', () => {
	describe('#isViewDetailsAction', () => {
		it('should include defaults', () => {
			expect(AuditActionTypes.isViewDetailsAction('create')).toBeTruthy();
			expect(AuditActionTypes.isViewDetailsAction('delete')).toBeTruthy();
		});

		it('should allow for registering actions', () => {
			expect(AuditActionTypes.isViewDetailsAction('new action')).toBeFalsy();
			AuditActionTypes.registerViewDetailsAction('new action');
			expect(AuditActionTypes.isViewDetailsAction('new action')).toBeTruthy();
		});
	});

	describe('#isViewChangesAction', () => {
		it('should include defaults', () => {
			expect(AuditActionTypes.isViewChangesAction('update')).toBeTruthy();
			expect(AuditActionTypes.isViewChangesAction('admin update')).toBeTruthy();
		});

		it('should allow for registering actions', () => {
			expect(AuditActionTypes.isViewChangesAction('new action')).toBeFalsy();
			AuditActionTypes.registerViewChangesAction('new action');
			expect(AuditActionTypes.isViewChangesAction('new action')).toBeTruthy();
		});
	});
});
