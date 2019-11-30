import { OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { SystemAlertService } from '../../../common/system-alert.module';

import { User } from '../../auth/user.model';
import { Role } from '../../auth/role.model';
import { ConfigService } from '../../config.service';

export abstract class ManageUserComponent implements OnDestroy, OnInit {

	config: any;
	error: string = null;
	proxyPki: boolean;
	metadataLocked: boolean;
	okDisabled: boolean;
	refreshing: boolean = false;

	possibleRoles = Role.ROLES;

	// Variables that will be set by implementing classes
	abstract mode: string;
	abstract title: string;
	abstract subtitle: string;
	abstract okButtonText: string;
	abstract navigateOnSuccess: string;
	user: User;

	protected destroy$: Subject<boolean> = new Subject();

	constructor(
		protected router: Router,
		protected configService: ConfigService,
		protected alertService: SystemAlertService
	) {
	}

	ngOnInit() {
		this.configService.getConfig()
			.pipe(
				takeUntil(this.destroy$)
			)
			.subscribe((config: any) => {
				this.config = config;
				this.proxyPki = config.auth === 'proxy-pki';

				this.metadataLocked = this.proxyPki;

				this.initialize();
			});
	}

	ngOnDestroy() {
		this.destroy$.next(true);
		this.destroy$.unsubscribe();
	}

	abstract initialize(): any;

	abstract submitUser(user: User): Observable<any>;

	abstract handleBypassAccessCheck(): any;

	submit() {
		if (this.validatePassword()) {
			this.submitUser(this.user)
				.subscribe(
					() => this.router.navigate([this.navigateOnSuccess]),
					(response: HttpErrorResponse) => {
						this.alertService.addClientErrorAlert(response);
					});
		}
	}

	refreshCredentials() {
		// TODO: Implement this.
	}

	bypassAccessCheck() {
		this.metadataLocked = null != (this.user) && !this.user.userModel.bypassAccessCheck;
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
