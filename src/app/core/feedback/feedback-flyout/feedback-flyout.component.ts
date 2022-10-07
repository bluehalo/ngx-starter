import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { untilDestroyed, UntilDestroy } from '@ngneat/until-destroy';
import isEmpty from 'lodash/isEmpty';
import { first } from 'rxjs/operators';

import { FlyoutComponent } from '../../../common/flyout/flyout.component';
import { ConfigService } from '../../config.service';
import { Feedback } from '../feedback.model';
import { FeedbackService } from '../feedback.service';

@UntilDestroy()
@Component({
	selector: 'app-feedback-flyout',
	templateUrl: './feedback-flyout.component.html',
	styleUrls: ['./feedback-flyout.component.scss']
})
export class FeedbackFlyoutComponent implements OnInit {
	@ViewChild(FlyoutComponent) flyout?: FlyoutComponent;

	baseUrl = '';
	feedback: Feedback = new Feedback();

	classificationOptions: any[] = [];

	status: 'ready' | 'submitting' | 'success' | 'failure' = 'ready';

	constructor(
		private router: Router,
		private configService: ConfigService,
		private feedbackService: FeedbackService
	) {}

	ngOnInit() {
		this.configService
			.getConfig()
			.pipe(first(), untilDestroyed(this))
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
			.pipe(untilDestroyed(this))
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
