import { NgTemplateOutlet } from '@angular/common';
import { Component, DestroyRef, ViewChild, computed, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { NgSelectModule } from '@ng-select/ng-select';

import { FlyoutComponent } from '../../../common/flyout/flyout.component';
import { APP_CONFIG } from '../../config.service';
import { Feedback } from '../feedback.model';
import { FeedbackService } from '../feedback.service';

@Component({
	selector: 'app-feedback-flyout',
	templateUrl: './feedback-flyout.component.html',
	styleUrls: ['./feedback-flyout.component.scss'],
	standalone: true,
	imports: [FlyoutComponent, FormsModule, NgTemplateOutlet, NgSelectModule]
})
export class FeedbackFlyoutComponent {
	@ViewChild(FlyoutComponent) flyout?: FlyoutComponent;

	feedback: Feedback = new Feedback();

	status: 'ready' | 'submitting' | 'success' | 'failure' = 'ready';

	private destroyRef = inject(DestroyRef);
	private router = inject(Router);
	private feedbackService = inject(FeedbackService);
	private config = inject(APP_CONFIG);

	classificationOptions = computed(() => {
		const options = this.config()?.feedback?.classificationOpts;
		if (options && Array.isArray(options) && options.length > 0) {
			return options;
		}
		return [];
	});

	closeForm() {
		this.flyout?.toggle();
		setTimeout(() => {
			this.feedback = new Feedback();
			this.status = 'ready';
		}, 1000);
	}

	submit() {
		this.status = 'submitting';

		// Get the current URL from the router at the time of submission.
		this.feedback.url = `${this.config()?.app?.clientUrl ?? ''}${this.router.url}`;
		this.feedbackService
			.create(this.feedback)
			.pipe(takeUntilDestroyed(this.destroyRef))
			.subscribe((feedback) => {
				if (feedback) {
					this.status = 'success';
					setTimeout(() => this.closeForm(), 2000);
				} else {
					this.status = 'failure';
				}
			});
	}
}
