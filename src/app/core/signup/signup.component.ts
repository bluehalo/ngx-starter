import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { SystemAlertService } from '../../common/system-alert.module';

import { ConfigService } from '../../core/config.service';

import { untilDestroyed, UntilDestroy } from '@ngneat/until-destroy';
import isEmpty from 'lodash/isEmpty';
import { Observable, Subscription } from 'rxjs';
import { ManageUserComponent } from '../admin/user-management/manage-user.component';
import { AuthenticationService } from '../auth/authentication.service';
import { User } from '../auth/user.model';

@UntilDestroy()
@Component({
	selector: 'user-signup',
	templateUrl: '../admin/user-management/manage-user.component.html'
})
export class SignupComponent extends ManageUserComponent implements OnDestroy, OnInit {
	mode = 'signup';

	inviteId: string;

	private routeParamSubscription: Subscription;

	constructor(
		protected router: Router,
		protected configService: ConfigService,
		protected alertService: SystemAlertService,
		private authService: AuthenticationService,
		private route: ActivatedRoute
	) {
		super(router, configService, alertService);
	}

	ngOnInit() {
		super.ngOnInit();
		this.routeParamSubscription = this.route.queryParams
			.pipe(untilDestroyed(this))
			.subscribe((params: Params) => {
				this.inviteId = params.inviteId;
				if (!isEmpty(params.email)) {
					this.user.userModel.email = params.email;
				}
			});
	}

	initialize() {
		this.title = 'New Account Request';
		this.subtitle = 'Provide the required information to request an account';
		this.okButtonText = 'Submit';
		this.navigateOnSuccess = '/signed-up';
		this.user = new User();
	}

	handleBypassAccessCheck() {
		// Don't need to do anything
	}

	submitUser(user: User): Observable<any> {
		return this.authService.signup(user);
	}

	ngOnDestroy() {
		this.routeParamSubscription.unsubscribe();
	}
}
