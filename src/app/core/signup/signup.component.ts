import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Observable } from 'rxjs';

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

	constructor(private authService: AuthenticationService, private route: ActivatedRoute) {
		super(
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
