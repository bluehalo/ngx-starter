import { DialogRef } from '@angular/cdk/dialog';
import { NgTemplateOutlet } from '@angular/common';
import {
	ChangeDetectionStrategy,
	Component,
	DestroyRef,
	computed,
	inject,
	signal
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { NgSelectModule } from '@ng-select/ng-select';

import { ModalComponent } from '../../../common';
import { APP_CONFIG } from '../../tokens';
import { Feedback } from '../feedback.model';
import { FeedbackService } from '../feedback.service';

@Component({
	templateUrl: 'feedback-modal.component.html',
	styleUrls: ['feedback-modal.component.scss'],
	standalone: true,
	imports: [ModalComponent, FormsModule, NgTemplateOutlet, NgSelectModule],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class FeedbackModalComponent {
	readonly #destroyRef = inject(DestroyRef);
	readonly #router = inject(Router);
	readonly #dialogRef = inject(DialogRef);
	readonly #feedbackService = inject(FeedbackService);
	readonly #config = inject(APP_CONFIG);

	readonly error = signal<string | undefined>(undefined);

	readonly submitting = signal(false);

	readonly classificationOptions = computed(() => {
		const options = this.#config()?.feedback?.classificationOpts;
		if (options && Array.isArray(options) && options.length > 0) {
			return options;
		}
		return [];
	});

	feedback = new Feedback();

	submit() {
		this.error.set(undefined);
		this.submitting.set(true);

		// Get the current URL from the router at the time of submission.
		this.feedback.url = `${this.#config()?.app?.clientUrl ?? ''}${this.#router.url}`;

		this.#feedbackService
			.create(this.feedback)
			.pipe(takeUntilDestroyed(this.#destroyRef))
			.subscribe((feedback) => {
				if (feedback) {
					setTimeout(() => this.#dialogRef.close(), 1500);
				}
			});
	}

	cancel() {
		this.#dialogRef.close();
	}
}
