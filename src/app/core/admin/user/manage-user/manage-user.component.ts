import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, DestroyRef, Input, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { first } from 'rxjs/operators';

import { SystemAlertComponent } from '../../../../common/system-alert/system-alert.component';
import { SystemAlertService } from '../../../../common/system-alert/system-alert.service';
import { Role } from '../../../auth/role.model';
import { EditUser } from '../../../auth/user.model';
import { ConfigService } from '../../../config.service';
import { AdminUsersService } from '../admin-users.service';

@Component({
	standalone: true,
	imports: [CommonModule, RouterLink, SystemAlertComponent, FormsModule, TooltipModule],
	templateUrl: './manage-user.component.html',
	styleUrls: ['./manage-user.component.scss']
})
export class ManageUserComponent implements OnInit {
	mode: 'create' | 'edit' = 'create';

	@Input()
	user: EditUser;

	proxyPki = false;
	metadataLocked = false;
	possibleRoles = Role.ROLES;

	protected destroyRef = inject(DestroyRef);
	protected router = inject(Router);
	protected configService = inject(ConfigService);
	private alertService = inject(SystemAlertService);
	private adminUsersService = inject(AdminUsersService);

	ngOnInit() {
		this.alertService.clearAllAlerts();

		if (this.user) {
			this.mode = 'edit';
			this.user.externalRolesDisplay = this.user.externalRoles?.join('\n');
			this.user.externalGroupsDisplay = this.user.externalGroups?.join('\n');
			this.metadataLocked = this.proxyPki && !this.user.bypassAccessCheck;
		} else {
			this.user = new EditUser();
		}

		this.configService
			.getConfig()
			.pipe(first(), takeUntilDestroyed(this.destroyRef))
			.subscribe((config: any) => {
				this.proxyPki = config.auth === 'proxy-pki';
				this.metadataLocked = this.proxyPki;
			});
	}

	submitUser(): any {
		if (this.validatePassword()) {
			const obs$ =
				this.mode === 'create'
					? this.adminUsersService.create(this.user)
					: this.adminUsersService.update(this.user);

			obs$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
				next: () => this.router.navigate(['/admin/users']),
				error: (error: unknown) => {
					if (error instanceof HttpErrorResponse) {
						this.alertService.addClientErrorAlert(error);
					}
				}
			});
		}
	}

	private validatePassword(): boolean {
		if (this.user.password === this.user.verifyPassword) {
			return true;
		}

		this.alertService.addAlert('Passwords must match', 'danger');
		return false;
	}
}
