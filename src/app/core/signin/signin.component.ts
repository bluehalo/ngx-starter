import { HttpErrorResponse } from '@angular/common/http';
import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { first } from 'rxjs/operators';

import { LoadingSpinnerComponent } from '../../common/loading-spinner/loading-spinner.component';
import { SessionService } from '../auth/session.service';
import { ConfigService } from '../config.service';
import { NavigationService } from '../navigation.service';

@Component({
	templateUrl: 'signin.component.html',
	styleUrls: ['signin.component.scss'],
	standalone: true,
	imports: [LoadingSpinnerComponent, FormsModule, RouterLink]
})
export class SigninComponent implements OnInit {
	loaded = false;
	pkiMode = false;

	username?: string;
	password?: string;
	error?: string;

	private destroyRef = inject(DestroyRef);
	private configService = inject(ConfigService);
	private sessionService = inject(SessionService);
	private navigationService = inject(NavigationService);

	ngOnInit() {
		this.configService
			.getConfig()
			.pipe(first(), takeUntilDestroyed(this.destroyRef))
			.subscribe((config) => {
				this.pkiMode = config?.auth === 'proxy-pki' ?? false;
				this.loaded = true;

				if (this.pkiMode) {
					// Automatically sign in
					this.pkiSignin();
				}
			});
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
