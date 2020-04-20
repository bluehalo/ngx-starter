import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Observable } from 'rxjs';
import { SystemAlertService } from '../../../common/system-alert.module';
import { User } from '../../auth/user.model';
import { ConfigService } from '../../config.service';
import { AdminUsersService } from './admin-users.service';
import { ManageUserComponent } from './manage-user.component';

@Component({
	selector: 'admin-edit-user',
	templateUrl: './manage-user.component.html'
})
export class AdminUpdateUserComponent extends ManageUserComponent implements OnDestroy {
	private id: string;

	private sub: any;

	mode = 'admin-edit';

	constructor(
		protected router: Router,
		protected configService: ConfigService,
		protected alertService: SystemAlertService,
		private route: ActivatedRoute,
		private adminUsersService: AdminUsersService
	) {
		super(router, configService, alertService);
	}

	initialize() {
		this.sub = this.route.params.subscribe((params: any) => {
			this.id = params.id;

			this.title = 'Edit User';
			this.subtitle = "Make changes to the user's information";
			this.okButtonText = 'Save';
			this.navigateOnSuccess = '/admin/users';
			this.okDisabled = false;
			this.adminUsersService.get(this.id).subscribe((userRaw: any) => {
				this.user = new User().setFromUserModel(userRaw);
				if (null == this.user.userModel.roles) {
					this.user.userModel.roles = {};
				}
				this.user.userModel.externalRolesDisplay = this.user.userModel.externalRoles?.join(
					'\n'
				);
				this.user.userModel.externalGroupsDisplay = this.user.userModel.externalGroups?.join(
					'\n'
				);
				this.user.userModel.providerData = {
					dn:
						null != this.user.userModel.providerData
							? this.user.userModel.providerData.dn
							: undefined
				};
				this.metadataLocked = this.proxyPki && !this.user.userModel.bypassAccessCheck;
			});
		});
	}

	ngOnDestroy() {
		this.sub.unsubscribe();
	}

	handleBypassAccessCheck() {
		// Don't need to do anything
	}

	submitUser(user: User): Observable<any> {
		return this.adminUsersService.update(user);
	}
}
