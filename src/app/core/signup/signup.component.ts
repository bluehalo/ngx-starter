import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Params, RouterLink } from '@angular/router';

import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { Observable } from 'rxjs';

import { SystemAlertComponent } from '../../common/system-alert/system-alert.component';
import { ManageUserComponent } from '../admin/user-management/manage-user.component';
import { AuthenticationService } from '../auth/authentication.service';
import { User } from '../auth/user.model';

@UntilDestroy()
@Component({
	selector: 'user-signup',
	templateUrl: '../admin/user-management/manage-user.component.html',
	standalone: true,
	imports: [NgIf, RouterLink, SystemAlertComponent, FormsModule, NgFor, TooltipModule]
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
