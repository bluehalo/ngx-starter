import { Routes } from '@angular/router';

import { AdminCreateUserComponent } from './admin-create-user.component';
import { AdminEditUserComponent } from './admin-edit-user.component';
import { AdminListUsersComponent } from './list-users/admin-list-users.component';

export const ADMIN_USER_ROUTES: Routes = [
	{
		path: 'users',
		component: AdminListUsersComponent
	},
	{
		path: 'user',
		component: AdminCreateUserComponent
	},
	{
		path: 'user/:id',
		component: AdminEditUserComponent
	}
];
