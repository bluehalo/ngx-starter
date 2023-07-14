import { CdkTableModule } from '@angular/cdk/table';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { NgSelectModule } from '@ng-select/ng-select';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ModalModule as BsModalModule } from 'ngx-bootstrap/modal';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';

import { DirectivesModule } from '../../common/directives.module';
import { ModalModule } from '../../common/modal.module';
import { PipesModule } from '../../common/pipes.module';
import { SystemAlertModule } from '../../common/system-alert.module';
import { TableModule } from '../../common/table.module';
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
import { AuditActorFilterDirective } from './list-audit-entries/audit-actor-filter.directive';
import { AuditDistinctValueFilterDirective } from './list-audit-entries/audit-distinct-value-filter.directive';
import { ListAuditEntriesComponent } from './list-audit-entries/list-audit-entries.component';

@NgModule({
	imports: [
		BsDatepickerModule,
		BsModalModule,
		TypeaheadModule,
		TooltipModule,
		NgSelectModule,

		AuditRoutingModule,
		CommonModule,
		DirectivesModule,
		FormsModule,
		PipesModule,
		SystemAlertModule,
		CdkTableModule,
		TableModule,
		ModalModule
	],
	exports: [],
	declarations: [
		ListAuditEntriesComponent,
		AuditViewChangeModalComponent,
		AuditViewDetailsModalComponent,
		AuditDistinctValueFilterDirective,
		AuditActorFilterDirective,
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
