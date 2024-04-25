import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, DestroyRef, computed, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { LoadingSpinnerComponent } from '../../common/loading-spinner/loading-spinner.component';
import { SessionService } from '../auth/session.service';
import { APP_CONFIG } from '../config.service';
import { NavigationService } from '../navigation.service';

@Component({
	templateUrl: 'signin.component.html',
	styleUrls: ['signin.component.scss'],
	standalone: true,
	imports: [LoadingSpinnerComponent, FormsModule, RouterLink],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class SigninComponent {
	username?: string;
	password?: string;
	error?: string;

	private destroyRef = inject(DestroyRef);
	private sessionService = inject(SessionService);
	private navigationService = inject(NavigationService);
	private config = inject(APP_CONFIG);

	pkiMode = computed(() => this.config()?.auth === 'proxy-pki' ?? false);

	constructor() {
		if (this.pkiMode()) {
			this.pkiSignin();
		}
	}

	pkiSignin() {
		this.sessionService
			.reloadSession()
			.pipe(takeUntilDestroyed(this.destroyRef))
			.subscribe({
				next: () => {
					this.navigationService.navigateToPreviousRoute();
				},
				error: (error: unknown) => {
					if (error instanceof HttpErrorResponse) {
						this.error = error.error?.message ?? 'Unexpected error signing in.';
					}
				}
			});
	}

	signin() {
		if (this.username && this.password) {
			this.sessionService
				.signin(this.username, this.password)
				.pipe(takeUntilDestroyed(this.destroyRef))
				.subscribe({
					next: () => {
						this.navigationService.navigateToPreviousRoute();
					},
					error: (error: unknown) => {
						if (error instanceof HttpErrorResponse) {
							this.error = error.error?.message ?? 'Unexpected error signing in.';
						}
					}
				});
		}
	}
}
