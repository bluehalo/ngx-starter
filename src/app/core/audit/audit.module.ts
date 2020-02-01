import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { NgSelectModule } from '@ng-select/ng-select';

import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';

import { DirectivesModule } from '../../common/directives.module';
import { PagingModule } from '../../common/paging.module';
import { PipesModule } from '../../common/pipes.module';
import { SystemAlertModule } from '../../common/system-alert.module';

import { AuditRoutingModule } from './audit-routing.module';
import { AuditService } from './audit.service';
import { ListAuditEntriesComponent } from './list-audit-entries/list-audit-entries.component';
import {
	AuditObjectComponent,
	UrlAuditObjectComponent,
	DefaultAuditObjectComponent,
	ExportAuditObjectComponent,
	UserAuditObjectComponent,
	UserAuthenticationObjectComponent
} from './audit-object.component';
import { AuditViewChangeModalComponent } from './audit-view-change-modal/audit-view-change-modal.component';
import { AuditViewDetailsModalComponent } from './audit-view-details-modal/audit-view-details-modal.component';

@NgModule({
	imports: [
		BsDatepickerModule.forRoot(),
		ModalModule.forRoot(),
		TypeaheadModule.forRoot(),
		NgSelectModule,

		AuditRoutingModule,
		CommonModule,
		DirectivesModule,
		FormsModule,
		PagingModule,
		PipesModule,
		SystemAlertModule
	],
	entryComponents: [
		AuditViewChangeModalComponent,
		AuditViewDetailsModalComponent,

		DefaultAuditObjectComponent,
		ExportAuditObjectComponent,
		UrlAuditObjectComponent,
		UserAuditObjectComponent,
		UserAuthenticationObjectComponent
	],
	exports: [],
	declarations: [
		ListAuditEntriesComponent,
		AuditViewChangeModalComponent,
		AuditViewDetailsModalComponent,

		AuditObjectComponent,
		UrlAuditObjectComponent,
		DefaultAuditObjectComponent,
		ExportAuditObjectComponent,
		UrlAuditObjectComponent,
		UserAuditObjectComponent,
		UserAuthenticationObjectComponent
	],
	providers: [AuditService]
})
export class AuditModule {}

export { AuditObjectTypes } from './audit.classes';
export { ListAuditEntriesComponent } from './list-audit-entries/list-audit-entries.component';
