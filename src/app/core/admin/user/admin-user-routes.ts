import { Routes } from '@angular/router';

import { userResolver } from './admin-users.service';
import { AdminListUsersComponent } from './list-users/admin-list-users.component';
import { ManageUserComponent } from './manage-user/manage-user.component';

export const ADMIN_USER_ROUTES: Routes = [
	{
		path: 'users',
		component: AdminListUsersComponent
	},
	{
		path: 'user',
		component: ManageUserComponent
	},
	{
		path: 'user/:id',
		resolve: {
			user: userResolver
		},
		component: ManageUserComponent
	}
];
