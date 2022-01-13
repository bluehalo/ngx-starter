import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Observable } from 'rxjs';

import { SystemAlertService } from '../../../common/system-alert.module';
import { User } from '../../auth/user.model';
import { ConfigService } from '../../config.service';
import { AdminUsersService } from './admin-users.service';
import { ManageUserComponent } from './manage-user.component';

@UntilDestroy()
@Component({
	selector: 'admin-edit-user',
	templateUrl: './manage-user.component.html'
})
export class AdminEditUserComponent extends ManageUserComponent {
	mode = 'admin-edit';

	constructor(
		router: Router,
		configService: ConfigService,
		alertService: SystemAlertService,
		private route: ActivatedRoute,
		private adminUsersService: AdminUsersService
	) {
		super(
			router,
			configService,
			alertService,
			'Edit User',
			"Make changes to the user's information",
			'Save',
			'/admin/users'
		);
	}

	initialize() {
		this.route.params.subscribe((params) => {
			this.okDisabled = false;
			this.adminUsersService
				.get(params['id'])
				.pipe(untilDestroyed(this))
				.subscribe((userRaw: any) => {
					this.user = new User().setFromUserModel(userRaw);
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
		});
	}

	handleBypassAccessCheck() {
		// Don't need to do anything
	}

	submitUser(user: User): Observable<any> {
		return this.adminUsersService.update(user);
	}
}
