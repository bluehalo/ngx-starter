import { TitleCasePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { SystemAlertComponent, SystemAlertService } from '../../common/system-alert';
import { AuthenticationService, EditUser } from '../auth';

@Component({
	standalone: true,
	templateUrl: './signup.component.html',
	imports: [RouterLink, SystemAlertComponent, FormsModule, TitleCasePipe],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class SignupComponent {
	readonly #destroyRef = inject(DestroyRef);
	readonly #router = inject(Router);
	readonly #alertService = inject(SystemAlertService);
	readonly #authService = inject(AuthenticationService);

	user = new EditUser();

	submit() {
		if (this.validatePassword()) {
			this.#authService
				.signup(this.user)
				.pipe(takeUntilDestroyed(this.#destroyRef))
				.subscribe({
					next: () => this.#router.navigate(['/signed-up']),
					error: (error: unknown) => {
						if (error instanceof HttpErrorResponse) {
							this.#alertService.addClientErrorAlert(error);
						}
					}
				});
		}
	}

	private validatePassword(): boolean {
		if (this.user.password === this.user.verifyPassword) {
			return true;
		}
		this.#alertService.addAlert('Passwords must match', 'danger');
		return false;
	}
}
