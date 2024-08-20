import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, DestroyRef, computed, inject, input } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';

import { SkipToDirective } from '../../../../common';
import { JoinPipe } from '../../../../common/pipes';
import { SystemAlertComponent, SystemAlertService } from '../../../../common/system-alert';
import { EditUser, Role } from '../../../auth';
import { APP_CONFIG } from '../../../tokens';
import { AdminUsersService } from '../admin-users.service';

@Component({
	standalone: true,
	imports: [
		CommonModule,
		RouterLink,
		SystemAlertComponent,
		FormsModule,
		SkipToDirective,
		JoinPipe,
		NgbTooltip
	],
	templateUrl: './manage-user.component.html',
	styleUrls: ['./manage-user.component.scss']
})
export class ManageUserComponent {
	readonly #alertService = inject(SystemAlertService);
	readonly #adminUsersService = inject(AdminUsersService);

	protected readonly destroyRef = inject(DestroyRef);
	protected readonly router = inject(Router);
	protected readonly config = inject(APP_CONFIG);

	readonly proxyPki = computed(() => this.config()?.auth === 'proxy-pki');
	readonly metadataLocked = computed(() => this.proxyPki());

	readonly user = input.required({
		transform: (value?: EditUser) => value ?? new EditUser()
	});

	readonly mode = computed(() => (this.user()._id ? 'edit' : 'create'));

	readonly possibleRoles = Role.ROLES;

	constructor() {
		this.#alertService.clearAllAlerts();
	}

	submitUser(): void {
		if (this.validatePassword()) {
			const obs$ =
				this.mode() === 'create'
					? this.#adminUsersService.create(this.user())
					: this.#adminUsersService.update(this.user());

			obs$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
				next: () => this.router.navigate(['/admin/users']),
				error: (error: unknown) => {
					if (error instanceof HttpErrorResponse) {
						this.#alertService.addClientErrorAlert(error);
					}
				}
			});
		}
	}

	private validatePassword(): boolean {
		if (this.user().password === this.user().verifyPassword) {
			return true;
		}

		this.#alertService.addAlert('Passwords must match', 'danger');
		return false;
	}
}
