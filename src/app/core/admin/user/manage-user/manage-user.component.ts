import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, DestroyRef, Input, OnInit, computed, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { TooltipModule } from 'ngx-bootstrap/tooltip';

import { SystemAlertComponent } from '../../../../common/system-alert/system-alert.component';
import { SystemAlertService } from '../../../../common/system-alert/system-alert.service';
import { EditUser, Role } from '../../../auth';
import { APP_CONFIG } from '../../../tokens';
import { AdminUsersService } from '../admin-users.service';

@Component({
	standalone: true,
	imports: [CommonModule, RouterLink, SystemAlertComponent, FormsModule, TooltipModule],
	templateUrl: './manage-user.component.html',
	styleUrls: ['./manage-user.component.scss']
})
export class ManageUserComponent implements OnInit {
	readonly #alertService = inject(SystemAlertService);
	readonly #adminUsersService = inject(AdminUsersService);

	protected readonly destroyRef = inject(DestroyRef);
	protected readonly router = inject(Router);
	protected readonly config = inject(APP_CONFIG);

	readonly proxyPki = computed(() => this.config()?.auth === 'proxy-pki');
	readonly metadataLocked = computed(() => this.proxyPki());

	readonly possibleRoles = Role.ROLES;

	mode: 'create' | 'edit' = 'create';

	@Input()
	user: EditUser;

	ngOnInit() {
		this.#alertService.clearAllAlerts();

		if (this.user) {
			this.mode = 'edit';
			this.user.externalRolesDisplay = this.user.externalRoles?.join('\n');
			this.user.externalGroupsDisplay = this.user.externalGroups?.join('\n');
		} else {
			this.user = new EditUser();
		}
	}

	submitUser(): any {
		if (this.validatePassword()) {
			const obs$ =
				this.mode === 'create'
					? this.#adminUsersService.create(this.user)
					: this.#adminUsersService.update(this.user);

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
		if (this.user.password === this.user.verifyPassword) {
			return true;
		}

		this.#alertService.addAlert('Passwords must match', 'danger');
		return false;
	}
}
