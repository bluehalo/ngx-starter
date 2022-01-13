import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { UntilDestroy } from '@ngneat/until-destroy';
import { Observable } from 'rxjs';

import { SystemAlertService } from '../../../common/system-alert.module';
import { User } from '../../auth/user.model';
import { ConfigService } from '../../config.service';
import { AdminUsersService } from './admin-users.service';
import { ManageUserComponent } from './manage-user.component';

@UntilDestroy()
@Component({
	selector: 'admin-create-user',
	templateUrl: 'manage-user.component.html'
})
export class AdminCreateUserComponent extends ManageUserComponent {
	mode = 'admin-create';

	constructor(
		router: Router,
		configService: ConfigService,
		alertService: SystemAlertService,
		private adminUsersService: AdminUsersService
	) {
		super(
			router,
			configService,
			alertService,
			'Create User',
			'Provide the required information to create a new user',
			'Create',
			'/admin/users'
		);
	}

	initialize() {
		this.user.userModel.roles = {};
	}

	handleBypassAccessCheck() {
		// Don't need to do anything
	}

	submitUser(user: User): Observable<any> {
		return this.adminUsersService.create(user);
	}
}
