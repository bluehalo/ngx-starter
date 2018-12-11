import { ActivatedRoute, Params, Router } from '@angular/router';
import { Component } from '@angular/core';

import * as _ from 'lodash';
import { Observable, Subscription } from 'rxjs';

import { ManageUserComponent } from '../admin/user-management/manage-user.component';
import { ConfigService } from '../../core/config.service';
import { AuthenticationService } from '../auth/authentication.service';
import { User } from '../auth/user.model';

@Component({
	selector: 'user-signup',
	templateUrl: '../admin/user-management/manage-user.component.html',
	styles: ['.card { margin: 3rem 1rem 4rem; }']


})
export class SignupComponent extends ManageUserComponent {

	mode = 'signup';

	inviteId: string;

	private routeParamSubscription: Subscription;

	constructor(
		protected router: Router,
		protected configService: ConfigService,
		private authService: AuthenticationService,
		private route: ActivatedRoute
	) {
		super(router, configService);
	}

	ngOnInit() {
		super.ngOnInit();
		this.routeParamSubscription = this.route.queryParams.subscribe((params: Params) => {
			this.inviteId = params.inviteId;
			if (!_.isEmpty(params.email)) {
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
