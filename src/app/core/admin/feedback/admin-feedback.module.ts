import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { PagingModule } from '../../../common/paging.module';
import { PipesModule } from '../../../common/pipes.module';
import { SearchInputModule } from '../../../common/search-input.module';
import { SystemAlertModule } from '../../../common/system-alert.module';
import { AdminListFeedbackComponent } from './admin-list-feedback.component';

@NgModule({
	imports: [
		CommonModule,

		TooltipModule.forRoot(),

		PagingModule,
		PipesModule,
		SearchInputModule,
		SystemAlertModule
	],
	exports: [AdminListFeedbackComponent],
	declarations: [AdminListFeedbackComponent]
})
export class AdminFeedbackModule {}
