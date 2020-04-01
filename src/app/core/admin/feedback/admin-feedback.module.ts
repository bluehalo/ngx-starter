import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminListFeedbackComponent } from './admin-list-feedback.component';
import { PagingModule } from '../../../common/paging.module';
import { SystemAlertModule } from '../../../common/system-alert.module';
import { SearchInputModule } from '../../../common/search-input.module';
import { PipesModule } from '../../../common/pipes.module';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

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
