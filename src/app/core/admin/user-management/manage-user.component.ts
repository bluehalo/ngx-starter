import { HttpErrorResponse } from '@angular/common/http';
import { DestroyRef, Directive, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';

import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';

import { SystemAlertService } from '../../../common/system-alert/system-alert.service';
import { Role } from '../../auth/role.model';
import { User } from '../../auth/user.model';
import { ConfigService } from '../../config.service';

@Directive()
export abstract class ManageUserComponent implements OnInit {
	config: any;
	error?: string;
	proxyPki = false;
	metadataLocked = false;
	user: User = new User();
	possibleRoles = Role.ROLES;

	protected destroyRef = inject(DestroyRef);
	protected router = inject(Router);
	protected configService = inject(ConfigService);
	protected alertService = inject(SystemAlertService);

	protected constructor(
		public title: string,
		public subtitle: string,
		public okButtonText: string,
		protected navigateOnSuccess: string
	) {}

	ngOnInit() {
		this.configService
			.getConfig()
			.pipe(first(), takeUntilDestroyed(this.destroyRef))
			.subscribe((config: any) => {
				this.config = config;
				this.proxyPki = config.auth === 'proxy-pki';
				this.metadataLocked = this.proxyPki;

				this.initialize();
			});
	}

	abstract initialize(): void;

	abstract submitUser(user: User): Observable<any>;

	abstract handleBypassAccessCheck(): any;

	submit() {
		if (this.validatePassword()) {
			this.submitUser(this.user)
				.pipe(takeUntilDestroyed(this.destroyRef))
				.subscribe({
					next: () => this.router.navigate([this.navigateOnSuccess]),
					error: (error: unknown) => {
						if (error instanceof HttpErrorResponse) {
							this.alertService.addClientErrorAlert(error);
						}
					}
				});
		}
	}

	bypassAccessCheck() {
		this.metadataLocked = !(this.user?.userModel?.bypassAccessCheck ?? false);
		this.handleBypassAccessCheck();
	}

	private validatePassword(): boolean {
		if (this.user.userModel.password === this.user.userModel.verifyPassword) {
			return true;
		}
		this.error = 'Passwords must match';
		return false;
	}
}
