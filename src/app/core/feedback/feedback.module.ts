import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TooltipModule } from 'ngx-bootstrap/tooltip';

import { NgSelectModule } from '@ng-select/ng-select';

import { FlyoutModule } from '../../common/flyout.module';

import { FeedbackService } from './feedback.service';
import { FeedbackModalComponent } from './feedback-modal/feedback-modal.component';
import { FeedbackFlyoutComponent } from './feedback-flyout/feedback-flyout.component';

@NgModule({
	imports: [TooltipModule.forRoot(), NgSelectModule, CommonModule, FormsModule, FlyoutModule],
	exports: [FeedbackModalComponent, FeedbackFlyoutComponent],
	declarations: [FeedbackModalComponent, FeedbackFlyoutComponent]
})
export class FeedbackModule {}
export { FeedbackModalComponent } from './feedback-modal/feedback-modal.component';
export { FeedbackService } from './feedback.service';
