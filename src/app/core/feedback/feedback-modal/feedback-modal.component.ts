import { NgIf, NgTemplateOutlet } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { NgSelectModule } from '@ng-select/ng-select';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import isEmpty from 'lodash/isEmpty';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { first } from 'rxjs/operators';

import { ModalComponent } from '../../../common/modal/modal/modal.component';
import { ConfigService } from '../../config.service';
import { Feedback } from '../feedback.model';
import { FeedbackService } from '../feedback.service';

@UntilDestroy()
@Component({
	templateUrl: 'feedback-modal.component.html',
	styleUrls: ['feedback-modal.component.scss'],
	standalone: true,
	imports: [ModalComponent, FormsModule, NgIf, NgTemplateOutlet, NgSelectModule]
})
export class FeedbackModalComponent implements OnInit {
	error: string | null = null;

	submitting = false;

	classificationOptions: any[] = [];

	baseUrl = '';

	feedback: Feedback = new Feedback();

	constructor(
		private router: Router,
		private configService: ConfigService,
		private feedbackService: FeedbackService,
		public modalRef: BsModalRef
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

	submit() {
		this.error = null;
		this.submitting = true;

		// Get the current URL from the router at the time of submission.
		this.feedback.url = `${this.baseUrl}${this.router.url}`;

		this.feedbackService
			.create(this.feedback)
			.pipe(untilDestroyed(this))
			.subscribe((feedback) => {
				if (feedback) {
					setTimeout(() => this.modalRef.hide(), 1500);
				}
			});
	}
}
