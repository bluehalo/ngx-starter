import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

import isEmpty from 'lodash/isEmpty';
import { first } from 'rxjs/operators';

import { FlyoutComponent } from '../../../common/flyout/flyout.component';
import { ConfigService } from '../../config.service';
import { Feedback } from '../feedback.model';
import { FeedbackService } from '../feedback.service';

@Component({
	selector: 'app-feedback-flyout',
	templateUrl: './feedback-flyout.component.html',
	styleUrls: ['./feedback-flyout.component.scss']
})
export class FeedbackFlyoutComponent implements OnInit {

	@ViewChild(FlyoutComponent, { static: false }) flyout: FlyoutComponent;

	feedback: Feedback = new Feedback();

	classificationOptions: any[];

	status: 'ready' | 'submitting' | 'success' | 'failure' = 'ready';
	errorMsg: string;

	constructor(
		private router: Router,
		private configService: ConfigService,
		private feedbackService: FeedbackService
	) {}

	ngOnInit() {
		this.configService.getConfig().pipe(first()).subscribe((config: any) => {
			this.feedback.currentRoute = `${config.app.baseUrl}${this.router.url}`;

			if (Array.isArray(config.feedback.classificationOpts) && !isEmpty(config.feedback.classificationOpts)) {
				this.classificationOptions = config.feedback.classificationOpts;
			}
		});
	}

	closeForm() {
		this.flyout.toggle();
		setTimeout(() => {
			this.feedback = new Feedback();
			this.status = 'ready';
		}, 1000);
	}

	submit() {
		this.status = 'submitting';

		this.feedbackService.submit(this.feedback).subscribe(() => {
			this.status = 'success';
			setTimeout(() => {
					this.closeForm();
				}, 2000
			);
		}, (error: HttpErrorResponse) => {
			this.status = 'failure';
			this.errorMsg = error.error.message;
		});
	}
}
