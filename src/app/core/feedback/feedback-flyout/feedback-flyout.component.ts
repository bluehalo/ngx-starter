import { NgTemplateOutlet } from '@angular/common';
import { Component, DestroyRef, OnInit, ViewChild, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { NgSelectModule } from '@ng-select/ng-select';
import isEmpty from 'lodash/isEmpty';
import { first } from 'rxjs/operators';

import { FlyoutComponent } from '../../../common/flyout/flyout.component';
import { ConfigService } from '../../config.service';
import { Feedback } from '../feedback.model';
import { FeedbackService } from '../feedback.service';

@Component({
	selector: 'app-feedback-flyout',
	templateUrl: './feedback-flyout.component.html',
	styleUrls: ['./feedback-flyout.component.scss'],
	standalone: true,
	imports: [FlyoutComponent, FormsModule, NgTemplateOutlet, NgSelectModule]
})
export class FeedbackFlyoutComponent implements OnInit {
	@ViewChild(FlyoutComponent) flyout?: FlyoutComponent;

	baseUrl = '';
	feedback: Feedback = new Feedback();

	classificationOptions: any[] = [];

	status: 'ready' | 'submitting' | 'success' | 'failure' = 'ready';

	private destroyRef = inject(DestroyRef);
	private router = inject(Router);
	private configService = inject(ConfigService);
	private feedbackService = inject(FeedbackService);

	ngOnInit() {
		this.configService
			.getConfig()
			.pipe(first(), takeUntilDestroyed(this.destroyRef))
			.subscribe((config: any) => {
				this.baseUrl = config.app.clientUrl || '';

				if (
					Array.isArray(config.feedback.classificationOpts) &&
					!isEmpty(config.feedback.classificationOpts)
				) {
					this.classificationOptions = config.feedback.classificationOpts;
				}
			});
	}

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
		this.feedback.url = `${this.baseUrl}${this.router.url}`;
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
