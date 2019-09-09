import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { NgSelectModule } from '@ng-select/ng-select';

import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';

import { AdminUsersService } from '../user-management/admin-users.service';
import { AuditViewChangeModal, AuditViewDetailModal } from './audit-view-change.component';
import { AuditService } from './audit.service';
import { ListAuditEntriesComponent } from './list-audit-entries/list-audit-entries.component';
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
		BsDatepickerModule.forRoot(),
		ModalModule.forRoot(),
		TypeaheadModule.forRoot(),
		NgSelectModule,

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
		ListAuditEntriesComponent,
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

export { ListAuditEntriesComponent } from './list-audit-entries/list-audit-entries.component';
