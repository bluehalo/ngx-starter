import { NgTemplateOutlet } from '@angular/common';
import {
	ChangeDetectionStrategy,
	Component,
	DestroyRef,
	computed,
	inject,
	signal,
	viewChild
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { NgSelectModule } from '@ng-select/ng-select';

import { FlyoutComponent } from '../../../common';
import { APP_CONFIG } from '../../tokens';
import { Feedback } from '../feedback.model';
import { FeedbackService } from '../feedback.service';

@Component({
	selector: 'app-feedback-flyout',
	templateUrl: './feedback-flyout.component.html',
	styleUrls: ['./feedback-flyout.component.scss'],
	standalone: true,
	imports: [FlyoutComponent, FormsModule, NgTemplateOutlet, NgSelectModule],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class FeedbackFlyoutComponent {
	readonly #destroyRef = inject(DestroyRef);
	readonly #router = inject(Router);
	readonly #feedbackService = inject(FeedbackService);
	readonly #config = inject(APP_CONFIG);

	readonly flyout = viewChild.required(FlyoutComponent);

	readonly status = signal<'ready' | 'submitting' | 'success' | 'failure'>('ready');

	readonly classificationOptions = computed(() => {
		const options = this.#config()?.feedback?.classificationOpts;
		if (options && Array.isArray(options) && options.length > 0) {
			return options;
		}
		return [];
	});

	feedback = new Feedback();

	closeForm() {
		this.flyout().toggle();
		setTimeout(() => {
			this.feedback = new Feedback();
			this.status.set('ready');
		}, 1000);
	}

	backToForm(): void {
		this.status.set('ready');
	}

	submit() {
		this.status.set('submitting');

		// Get the current URL from the router at the time of submission.
		this.feedback.url = `${this.#config()?.app?.clientUrl ?? ''}${this.#router.url}`;
		this.#feedbackService
			.create(this.feedback)
			.pipe(takeUntilDestroyed(this.#destroyRef))
			.subscribe((feedback) => {
				if (feedback) {
					this.status.set('success');
					setTimeout(() => this.closeForm(), 2000);
				} else {
					this.status.set('failure');
				}
			});
	}
}
