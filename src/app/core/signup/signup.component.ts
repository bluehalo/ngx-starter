import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Params, RouterLink } from '@angular/router';

import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { Observable } from 'rxjs';

import { SystemAlertComponent } from '../../common/system-alert/system-alert.component';
import { ManageUserComponent } from '../admin/user-management/manage-user.component';
import { AuthenticationService } from '../auth/authentication.service';
import { User } from '../auth/user.model';

@Component({
	selector: 'user-signup',
	templateUrl: '../admin/user-management/manage-user.component.html',
	standalone: true,
	imports: [NgIf, RouterLink, SystemAlertComponent, FormsModule, NgFor, TooltipModule]
})
export class SignupComponent extends ManageUserComponent implements OnInit {
	mode = 'signup';

	inviteId?: string;

	private authService = inject(AuthenticationService);
	private route = inject(ActivatedRoute);

	constructor() {
		super(
			'New Account Request',
			'Provide the required information to request an account',
			'Submit',
			'/signed-up'
		);
	}

	override ngOnInit() {
		super.ngOnInit();
		this.route.queryParams
			.pipe(takeUntilDestroyed(this.destroyRef))
			.subscribe((params: Params) => {
				this.inviteId = params['inviteId'];
				this.user.userModel.email = params['email'];
			});
	}

	initialize() {
		// no-op
	}

	handleBypassAccessCheck() {
		// Don't need to do anything
	}

	submitUser(user: User): Observable<any> {
		return this.authService.signup(user);
	}
}
