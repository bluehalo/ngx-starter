import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { NgSelectModule } from '@ng-select/ng-select';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

import { FlyoutModule } from '../../common/flyout.module';
import { ModalModule } from '../../common/modal.module';
import { FeedbackFlyoutComponent } from './feedback-flyout/feedback-flyout.component';
import { FeedbackModalComponent } from './feedback-modal/feedback-modal.component';

@NgModule({
	imports: [
		TooltipModule.forRoot(),
		NgSelectModule,
		CommonModule,
		FormsModule,
		FlyoutModule,
		ModalModule
	],
	exports: [FeedbackModalComponent, FeedbackFlyoutComponent],
	declarations: [FeedbackModalComponent, FeedbackFlyoutComponent]
})
export class FeedbackModule {}
export { FeedbackModalComponent } from './feedback-modal/feedback-modal.component';
export { FeedbackService } from './feedback.service';
