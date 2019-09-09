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
	DefaultAudit, ExportAudit, UserAudit,
	UserAuthentication
} from './audit-object.component';

import { DirectivesModule } from '../../../common/directives.module';
import { PagingModule } from '../../../common/paging.module';
import { PipesModule } from '../../..//common/pipes.module';

@NgModule({
	imports: [
		DatepickerModule.forRoot(),
		ModalModule.forRoot(),
		TypeaheadModule.forRoot(),

		CommonModule,
		DirectivesModule,
		FormsModule,
		PagingModule,
		PipesModule
	],
	entryComponents: [
		AuditViewChangeModal,
		AuditViewDetailModal,

		DefaultAudit,
		ExportAudit,
		UrlAudit,
		UserAudit,
		UserAuthentication
	],
	exports: [],
	declarations: [
		AuditComponent,
		AuditViewChangeModal,
		AuditViewDetailModal,

		AuditObjectComponent,
		UrlAudit,
		DefaultAudit,
		ExportAudit,
		UrlAudit,
		UserAudit,
		UserAuthentication
	],
	providers: [
		AuditService,
		AdminUsersService
	]
})
export class AuditModule { }

export { AuditComponent } from './audit.component';
