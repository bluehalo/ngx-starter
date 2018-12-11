import { Router } from '@angular/router';
import { Response } from '@angular/http';

import { Observable, Subject } from 'rxjs';

import { User } from '../../auth/user.model';
import { ConfigService } from '../../config.service';
import { takeUntil } from 'rxjs/internal/operators';
import { OnDestroy, OnInit } from '@angular/core';

export abstract class ManageUserComponent implements OnDestroy, OnInit {

	config: any;
	error: string = null;
	proxyPki: boolean;
	metadataLocked: boolean;
	okDisabled: boolean;

	// Variables that will be set by implementing classes
	title: string;
	subtitle: string;
	okButtonText: string;
	navigateOnSuccess: string;
	user: User;

	protected destroy$: Subject<boolean> = new Subject();

	constructor(
		protected router: Router,
		protected configService: ConfigService
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
					(response: Response) => {
						if (response.status >= 400 && response.status < 500) {
							let errors = response.json().message.split('\n');
							this.error = errors.join(', ');
						}
					});
		}
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
