import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { DatepickerModule, ModalModule, TypeaheadModule } from 'ngx-bootstrap';

import { AdminUsersService } from '../user-management/admin-users.service';
import { AuditViewChangeModal, AuditViewDetailModal } from './audit-view-change.component';
import { AuditService } from './audit.service';
import { AuditComponent } from './audit.component';
import {
	AuditObjectComponent, UrlAudit,
	DefaultAudit, ExportAudit
} from './audit-object.component';

@NgModule({
	imports: [
		DatepickerModule.forRoot(),
		ModalModule.forRoot(),
		TypeaheadModule.forRoot(),

		CommonModule,
		FormsModule
	],
	entryComponents: [
		AuditViewChangeModal,
		AuditViewDetailModal,

		DefaultAudit,
		ExportAudit
	],
	exports: [],
	declarations: [
		AuditComponent,
		AuditObjectComponent,
		AuditViewChangeModal,
		AuditViewDetailModal,
		UrlAudit,
		AuditObjectComponent,
		DefaultAudit,
		ExportAudit
	],
	providers: [
		AuditService,
		AdminUsersService
	]
})
export class AuditModule { }

export { AuditComponent } from './audit.component';
