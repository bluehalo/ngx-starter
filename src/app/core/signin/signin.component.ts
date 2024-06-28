import { HttpErrorResponse } from '@angular/common/http';
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
import { RouterLink } from '@angular/router';

import { LoadingSpinnerComponent } from '../../common';
import { SessionService } from '../auth';
import { NavigationService } from '../navigation.service';
import { APP_CONFIG } from '../tokens';

@Component({
	templateUrl: './signin.component.html',
	styleUrls: ['./signin.component.scss'],
	standalone: true,
	imports: [LoadingSpinnerComponent, FormsModule, RouterLink],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class SigninComponent {
	readonly #destroyRef = inject(DestroyRef);
	readonly #sessionService = inject(SessionService);
	readonly #navigationService = inject(NavigationService);
	readonly #config = inject(APP_CONFIG);

	readonly error = signal('');

	username?: string;
	password?: string;

	pkiMode = computed(() => this.#config()?.auth === 'proxy-pki');

	constructor() {
		if (this.pkiMode()) {
			this.pkiSignin();
		}
	}

	pkiSignin() {
		this.#sessionService
			.reloadSession()
			.pipe(takeUntilDestroyed(this.#destroyRef))
			.subscribe({
				next: () => {
					this.#navigationService.navigateToPreviousRoute();
				},
				error: (error: unknown) => this.handleError(error)
			});
	}

	signin() {
		if (this.username && this.password) {
			this.#sessionService
				.signin(this.username, this.password)
				.pipe(takeUntilDestroyed(this.#destroyRef))
				.subscribe({
					next: () => {
						this.#navigationService.navigateToPreviousRoute();
					},
					error: (error: unknown) => this.handleError(error)
				});
		}
	}

	handleError(error: unknown) {
		if (error instanceof HttpErrorResponse && error.error?.message) {
			this.error.set(error.error.message);
		} else {
			this.error.set('Unexpected error signing in.');
		}
	}
}
