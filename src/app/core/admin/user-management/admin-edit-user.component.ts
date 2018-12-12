import { Router, ActivatedRoute } from '@angular/router';
import { Component } from '@angular/core';

import { Observable } from 'rxjs';

import { User } from '../../auth/user.model';
import { Role } from '../../auth/role.model';
import { AdminUsersService } from './admin-users.service';
import { ManageUserComponent } from './manage-user.component';
import { ConfigService } from '../../config.service';
import { SystemAlertService } from '../../../common/system-alert.module';

@Component({
	selector: 'admin-edit-user',
	templateUrl: './manage-user.component.html'
})
export class AdminUpdateUserComponent extends ManageUserComponent {

	private mode = 'admin-edit';

	private possibleRoles = Role.ROLES;

	private id: string;

	private sub: any;

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
		this.sub = this.route.params.subscribe( (params: any) => {
			this.id = params.id;

			this.title = 'Edit User';
			this.subtitle = 'Make changes to the user\'s information';
			this.okButtonText = 'Save';
			this.navigateOnSuccess = '/admin/users';
			this.okDisabled = false;
			this.adminUsersService.get(this.id).subscribe((userRaw: any) => {
				this.user = new User().setFromUserModel(userRaw);
				if (null == this.user.userModel.roles) {
					this.user.userModel.roles = {};
				}
				this.user.userModel.providerData = { dn: (null != this.user.userModel.providerData) ? this.user.userModel.providerData.dn : undefined };
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
