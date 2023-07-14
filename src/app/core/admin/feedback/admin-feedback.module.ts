import { CdkTableModule } from '@angular/cdk/table';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

import { PipesModule } from '../../../common/pipes.module';
import { SearchInputModule } from '../../../common/search-input.module';
import { SystemAlertModule } from '../../../common/system-alert.module';
import { TableModule } from '../../../common/table.module';
import { AdminListFeedbackComponent } from './list-feedback/admin-list-feedback.component';

@NgModule({
	imports: [
		CommonModule,

		TooltipModule,

		PipesModule,
		SearchInputModule,
		SystemAlertModule,
		BsDropdownModule,
		CdkTableModule,
		TableModule
	],
	exports: [AdminListFeedbackComponent],
	declarations: [AdminListFeedbackComponent]
})
export class AdminFeedbackModule {}
