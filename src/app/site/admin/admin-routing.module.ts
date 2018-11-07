import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AdminListUsersComponent } from './user-management/admin-list-users.component';
import { AdminComponent } from './admin.component';
import { AuthGuard } from '../../core/core.module';

@NgModule({
	imports: [
		RouterModule.forChild([
			{
				path: 'admin',
				component: AdminComponent,
				canActivate: [AuthGuard],
				data: { roles: [ 'admin' ] },
				children: [
					/**
					 * Default Route
					 */
					{
						path: '',
						redirectTo: '/admin/users',
						pathMatch: 'full'
					},

					/**
					 * Admin User Routes
					 */
					{
						path: 'users',
						component: AdminListUsersComponent
					}
				]
			}])
	],
	exports: [
		RouterModule
	]
})
export class AdminRoutingModule { }
