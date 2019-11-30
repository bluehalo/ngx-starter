import { Router } from '@angular/router';
import { Component } from '@angular/core';

import { Observable } from 'rxjs';

import { SystemAlertService } from '../../../common/system-alert.module';
import { ManageUserComponent } from './manage-user.component';
import { AdminUsersService } from './admin-users.service';
import { ConfigService } from '../../config.service';
import { User } from '../../auth/user.model';

@Component({
	selector: 'admin-create-user',
	templateUrl: 'manage-user.component.html'
})
export class AdminCreateUserComponent extends ManageUserComponent {

	mode = 'admin-create';
	title = 'Create User';
	subtitle = 'Provide the required information to create a new user';
	okButtonText = 'Create';
	navigateOnSuccess = '/admin/users';

	constructor(
		protected router: Router,
		protected configService: ConfigService,
		protected alertService: SystemAlertService,
		private adminUsersService: AdminUsersService
	) {
		super(router, configService, alertService);
	}

	initialize() {
		this.user = new User();
		this.user.userModel.roles = {};
	}

	handleBypassAccessCheck() {
		// Don't need to do anything
	}

	submitUser(user: User): Observable<any> {
		return this.adminUsersService.create(user);
	}

}
