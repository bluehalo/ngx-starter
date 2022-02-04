import { Component } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Observable, switchMap } from 'rxjs';
import { map } from 'rxjs/operators';

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
		this.route.params
			.pipe(
				untilDestroyed(this),
				switchMap((params: Params) => this.adminUsersService.get(params['id'])),
				map((userRaw: any) => new User().setFromUserModel(userRaw))
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
