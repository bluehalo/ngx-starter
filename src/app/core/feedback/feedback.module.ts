import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TooltipModule } from 'ngx-bootstrap/tooltip';

import { NgSelectModule } from '@ng-select/ng-select';

import { DirectivesModule } from '../../common/directives.module';
import { PagingModule } from '../../common/paging.module';
import { PipesModule } from '../../common/pipes.module';
import { SystemAlertModule } from '../../common/system-alert.module';

import { AdminListFeedbackComponent } from './admin/admin-list-feedback.component';
import { FeedbackModalComponent } from './feedback-modal.component';
import { FeedbackService } from './feedback.service';
import { FeedbackRoutingModule } from './feedback-routing.module';
import { FeedbackFlyoutComponent } from './feedback-flyout/feedback-flyout.component';
import { FlyoutModule } from '../../common/flyout.module';
import { SearchInputModule } from '../../common/search-input.module';

@NgModule({
	imports: [
		TooltipModule.forRoot(),
		NgSelectModule,

		CommonModule,
		FormsModule,

		DirectivesModule,
		PagingModule,
		PipesModule,
		SystemAlertModule,
		SearchInputModule,
		FlyoutModule,

		FeedbackRoutingModule
	],
	exports: [AdminListFeedbackComponent, FeedbackModalComponent, FeedbackFlyoutComponent],
	entryComponents: [AdminListFeedbackComponent, FeedbackModalComponent],
	declarations: [AdminListFeedbackComponent, FeedbackModalComponent, FeedbackFlyoutComponent],
	providers: [FeedbackService]
})
export class FeedbackModule {}
export { AdminListFeedbackComponent } from './admin/admin-list-feedback.component';
export { FeedbackModalComponent } from './feedback-modal.component';
export { FeedbackService } from './feedback.service';
