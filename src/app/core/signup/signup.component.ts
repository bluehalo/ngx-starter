import { ActivatedRoute, Params, Router } from '@angular/router';
import { Component, OnDestroy, OnInit } from '@angular/core';

import { isEmpty } from 'lodash';
import { Observable, Subscription } from 'rxjs';

import { ManageUserComponent } from '../admin/user-management/manage-user.component';
import { ConfigService } from '../../core/config.service';
import { AuthenticationService } from '../auth/authentication.service';
import { User } from '../auth/user.model';
import { SystemAlertService } from '../../common/system-alert.module';

@Component({
	selector: 'user-signup',
	templateUrl: '../admin/user-management/manage-user.component.html'
})
export class SignupComponent extends ManageUserComponent implements OnDestroy, OnInit {

	mode = 'signup';
	title = 'New Account Request';
	subtitle = 'Provide the required information to request an account';
	okButtonText = 'Submit';
	navigateOnSuccess = '/signed-up';

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
		this.routeParamSubscription = this.route.queryParams.subscribe((params: Params) => {
			this.inviteId = params.inviteId;
			if (!isEmpty(params.email)) {
				this.user.userModel.email = params.email;
			}
		});
	}

	initialize() {

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
