import { NgFor, NgIf, TitleCasePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { TooltipModule } from 'ngx-bootstrap/tooltip';

import { SystemAlertComponent } from '../../common/system-alert/system-alert.component';
import { SystemAlertService } from '../../common/system-alert/system-alert.service';
import { AuthenticationService } from '../auth/authentication.service';
import { User } from '../auth/user.model';

@Component({
	standalone: true,
	templateUrl: './signup.component.html',
	imports: [
		NgIf,
		RouterLink,
		SystemAlertComponent,
		FormsModule,
		NgFor,
		TooltipModule,
		TitleCasePipe
	]
})
export class SignupComponent {
	user = new User();

	private destroyRef = inject(DestroyRef);
	private router = inject(Router);
	private alertService = inject(SystemAlertService);
	private authService = inject(AuthenticationService);

	submit() {
		if (this.validatePassword()) {
			this.authService
				.signup(this.user)
				.pipe(takeUntilDestroyed(this.destroyRef))
				.subscribe({
					next: () => this.router.navigate(['/signed-up']),
					error: (error: unknown) => {
						if (error instanceof HttpErrorResponse) {
							this.alertService.addClientErrorAlert(error);
						}
					}
				});
		}
	}

	private validatePassword(): boolean {
		if (this.user.userModel.password === this.user.userModel.verifyPassword) {
			return true;
		}
		this.alertService.addAlert('Passwords must match', 'danger');
		return false;
	}
}
