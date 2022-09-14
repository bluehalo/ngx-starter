import { Component, inject } from '@angular/core';

import { UntilDestroy } from '@ngneat/until-destroy';
import { Observable } from 'rxjs';

import { User } from '../../auth/user.model';
import { AdminUsersService } from './admin-users.service';
import { ManageUserComponent } from './manage-user.component';

@UntilDestroy()
@Component({
	selector: 'admin-create-user',
	templateUrl: 'manage-user.component.html'
})
export class AdminCreateUserComponent extends ManageUserComponent {
	mode = 'admin-create';

	private adminUsersService = inject(AdminUsersService);

	constructor() {
		super(
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
