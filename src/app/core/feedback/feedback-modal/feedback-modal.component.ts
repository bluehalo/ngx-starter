import { DialogRef } from '@angular/cdk/dialog';
import { NgTemplateOutlet } from '@angular/common';
import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { NgSelectModule } from '@ng-select/ng-select';
import isEmpty from 'lodash/isEmpty';
import { first } from 'rxjs/operators';

import { ModalComponent } from '../../../common/modal/modal/modal.component';
import { ConfigService } from '../../config.service';
import { Feedback } from '../feedback.model';
import { FeedbackService } from '../feedback.service';

@Component({
	templateUrl: 'feedback-modal.component.html',
	styleUrls: ['feedback-modal.component.scss'],
	standalone: true,
	imports: [ModalComponent, FormsModule, NgTemplateOutlet, NgSelectModule]
})
export class FeedbackModalComponent implements OnInit {
	error: string | null = null;

	submitting = false;

	classificationOptions: any[] = [];

	baseUrl = '';

	feedback: Feedback = new Feedback();

	private destroyRef = inject(DestroyRef);
	public dialogRef = inject(DialogRef);

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

	submit() {
		this.error = null;
		this.submitting = true;

		// Get the current URL from the router at the time of submission.
		this.feedback.url = `${this.baseUrl}${this.router.url}`;

		this.feedbackService
			.create(this.feedback)
			.pipe(takeUntilDestroyed(this.destroyRef))
			.subscribe((feedback) => {
				if (feedback) {
					setTimeout(() => this.dialogRef.close(), 1500);
				}
			});
	}
}
