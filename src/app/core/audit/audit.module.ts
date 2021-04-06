import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { NgSelectModule } from '@ng-select/ng-select';

import { DirectivesModule } from '../../common/directives.module';
import { PagingModule } from '../../common/paging.module';
import { PipesModule } from '../../common/pipes.module';
import { SystemAlertModule } from '../../common/system-alert.module';

import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ModalModule as BsModalModule } from 'ngx-bootstrap/modal';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import {
	AuditObjectComponent,
	DefaultAuditObjectComponent,
	ExportAuditObjectComponent,
	UrlAuditObjectComponent,
	UserAuditObjectComponent,
	UserAuthenticationObjectComponent
} from './audit-object.component';
import { AuditRoutingModule } from './audit-routing.module';
import { AuditViewChangeModalComponent } from './audit-view-change-modal/audit-view-change-modal.component';
import { AuditViewDetailsModalComponent } from './audit-view-details-modal/audit-view-details-modal.component';
import { AuditService } from './audit.service';
import { ListAuditEntriesComponent } from './list-audit-entries/list-audit-entries.component';
import { ModalModule } from '../../common/modal.module';

@NgModule({
	imports: [
		BsDatepickerModule.forRoot(),
		BsModalModule.forRoot(),
		TypeaheadModule.forRoot(),
		NgSelectModule,

		AuditRoutingModule,
		CommonModule,
		DirectivesModule,
		FormsModule,
		PagingModule,
		PipesModule,
		SystemAlertModule,
		ModalModule
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

export { ListAuditEntriesComponent } from './list-audit-entries/list-audit-entries.component';
