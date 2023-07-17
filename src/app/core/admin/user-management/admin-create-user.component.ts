import { NgFor, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { UntilDestroy } from '@ngneat/until-destroy';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { Observable } from 'rxjs';

import { SystemAlertComponent } from '../../../common/system-alert/system-alert.component';
import { User } from '../../auth/user.model';
import { AdminUsersService } from './admin-users.service';
import { ManageUserComponent } from './manage-user.component';

@UntilDestroy()
@Component({
	selector: 'admin-create-user',
	templateUrl: 'manage-user.component.html',
	standalone: true,
	imports: [NgIf, RouterLink, SystemAlertComponent, FormsModule, NgFor, TooltipModule]
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
