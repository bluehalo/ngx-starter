import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { untilDestroyed, UntilDestroy } from '@ngneat/until-destroy';
import isEmpty from 'lodash/isEmpty';
import { Observable } from 'rxjs';

import { SystemAlertService } from '../../common/system-alert.module';
import { ConfigService } from '../../core/config.service';
import { ManageUserComponent } from '../admin/user-management/manage-user.component';
import { AuthenticationService } from '../auth/authentication.service';
import { User } from '../auth/user.model';

@UntilDestroy()
@Component({
	selector: 'user-signup',
	templateUrl: '../admin/user-management/manage-user.component.html'
})
export class SignupComponent extends ManageUserComponent implements OnInit {
	mode = 'signup';

	inviteId?: string;

	constructor(
		router: Router,
		configService: ConfigService,
		alertService: SystemAlertService,
		private authService: AuthenticationService,
		private route: ActivatedRoute
	) {
		super(
			router,
			configService,
			alertService,
			'New Account Request',
			'Provide the required information to request an account',
			'Submit',
			'/signed-up'
		);
	}

	override ngOnInit() {
		super.ngOnInit();
		this.route.queryParams.pipe(untilDestroyed(this)).subscribe((params: Params) => {
			this.inviteId = params['inviteId'];
			this.user.userModel.email = params['email'];
		});
	}

	initialize() {}

	handleBypassAccessCheck() {
		// Don't need to do anything
	}

	submitUser(user: User): Observable<any> {
		return this.authService.signup(user);
	}
}
