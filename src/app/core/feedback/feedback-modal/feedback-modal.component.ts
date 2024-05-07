import { DialogRef } from '@angular/cdk/dialog';
import { NgTemplateOutlet } from '@angular/common';
import { Component, DestroyRef, computed, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { NgSelectModule } from '@ng-select/ng-select';

import { ModalComponent } from '../../../common/modal/modal/modal.component';
import { APP_CONFIG } from '../../tokens';
import { Feedback } from '../feedback.model';
import { FeedbackService } from '../feedback.service';

@Component({
	templateUrl: 'feedback-modal.component.html',
	styleUrls: ['feedback-modal.component.scss'],
	standalone: true,
	imports: [ModalComponent, FormsModule, NgTemplateOutlet, NgSelectModule]
})
export class FeedbackModalComponent {
	error: string | null = null;

	submitting = false;

	feedback: Feedback = new Feedback();

	private destroyRef = inject(DestroyRef);
	public dialogRef = inject(DialogRef);

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

	submit() {
		this.error = null;
		this.submitting = true;

		// Get the current URL from the router at the time of submission.
		this.feedback.url = `${this.config()?.app?.clientUrl ?? ''}${this.router.url}`;

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
