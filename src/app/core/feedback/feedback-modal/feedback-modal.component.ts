import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroupDirective } from '@angular/forms';
import { Router } from '@angular/router';

import { AbstractModalizedDirective } from '../../../common/modal/abstract-modalized.directive';

import { untilDestroyed, UntilDestroy } from '@ngneat/until-destroy';
import isEmpty from 'lodash/isEmpty';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { first } from 'rxjs/operators';
import { ConfigService } from '../../config.service';
import { Feedback } from '../feedback.model';
import { FeedbackService } from '../feedback.service';

@UntilDestroy()
@Component({
	templateUrl: 'feedback-modal.component.html'
})
export class FeedbackModalComponent extends AbstractModalizedDirective implements OnInit {
	@ViewChild('submitFeedbackForm') submitFeedbackForm: FormGroupDirective;

	error: string;

	success: string;

	submitting = false;

	classificationOptions: any[];

	baseUrl = '';

	feedback: Feedback = new Feedback();

	constructor(
		private router: Router,
		private configService: ConfigService,
		private feedbackService: FeedbackService,
		public modalRef: BsModalRef
	) {
		super();
		this.disableOkSubject.next(true);
	}

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

	onOk() {
		this.error = null;
		this.submitting = true;

		// Get the current URL from the router at the time of submission.
		this.feedback.currentRoute = `${this.baseUrl}${this.router.url}`;

		this.feedbackService
			.submit(this.feedback)
			.pipe(untilDestroyed(this))
			.subscribe(
				() => {
					this.success = 'Feedback successfully submitted!';
					setTimeout(() => this.modalRef.hide(), 1500);
				},
				(error: HttpErrorResponse) => {
					this.submitting = false;
					this.error = error.error.message;
				}
			);
	}

	onCancel(): void {}

	validateForm() {
		this.disableOkSubject.next(!this.submitFeedbackForm.valid);
	}
}
