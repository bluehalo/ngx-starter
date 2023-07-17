import { NgFor, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Params, RouterLink } from '@angular/router';

import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { Observable, switchMap } from 'rxjs';
import { map } from 'rxjs/operators';

import { SystemAlertComponent } from '../../../common/system-alert/system-alert.component';
import { User } from '../../auth/user.model';
import { AdminUsersService } from './admin-users.service';
import { ManageUserComponent } from './manage-user.component';

@UntilDestroy()
@Component({
	selector: 'admin-edit-user',
	templateUrl: './manage-user.component.html',
	standalone: true,
	imports: [NgIf, RouterLink, SystemAlertComponent, FormsModule, NgFor, TooltipModule]
})
export class AdminEditUserComponent extends ManageUserComponent {
	mode = 'admin-edit';

	private route = inject(ActivatedRoute);
	private adminUsersService = inject(AdminUsersService);

	constructor() {
		super('Edit User', "Make changes to the user's information", 'Save', '/admin/users');
	}

	initialize() {
		this.route.params
			.pipe(
				switchMap((params: Params) => this.adminUsersService.get(params['id'])),
				map((userRaw: any) => new User().setFromUserModel(userRaw)),
				untilDestroyed(this)
			)
			.subscribe((user) => {
				this.user = user;
				if (null == this.user.userModel.roles) {
					this.user.userModel.roles = {};
				}
				this.user.userModel.externalRolesDisplay =
					this.user.userModel.externalRoles?.join('\n');
				this.user.userModel.externalGroupsDisplay =
					this.user.userModel.externalGroups?.join('\n');
				this.user.userModel.providerData = {
					dn: this.user.userModel.providerData?.dn
				};
				this.metadataLocked = this.proxyPki && !this.user.userModel.bypassAccessCheck;
			});
	}

	handleBypassAccessCheck() {
		// Don't need to do anything
	}

	submitUser(user: User): Observable<any> {
		return this.adminUsersService.update(user);
	}
}
