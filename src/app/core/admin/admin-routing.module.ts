import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AdminCreateUserComponent } from './user-management/admin-create-user.component';
import { AdminListUsersComponent } from './user-management/admin-list-users.component';
import { AdminUpdateUserComponent } from './user-management/admin-edit-user.component';
import { AdminCreateEuaComponent, AdminListEuasComponent, AdminUpdateEuaComponent } from './end-user-agreement/admin-eua.module';
import { CacheEntriesComponent } from './cache-entries/cache-entries.module';
import { AdminComponent } from './admin.component';
import { AuthGuard } from '../auth/auth.guard';
import { AuditComponent } from './audit/audit.module';

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
					},
					{
						path: 'user',
						component: AdminCreateUserComponent
					},
					{
						path: 'user/:id',
						component: AdminUpdateUserComponent
					},

					/**
					 * Admin EUA Routes
					 */
					{
						path: 'euas',
						component: AdminListEuasComponent
					},
					{
						path: 'eua',
						component: AdminCreateEuaComponent
					},
					{
						path: 'eua/:id',
						component: AdminUpdateEuaComponent
					},

					/**
					 * Admin Access Checker Cache Entries Route
					 */
					{
						path: 'cacheEntries',
						component: CacheEntriesComponent
					},

					{
						path: 'audit',
						component: AuditComponent
					}
				]
			}])
	],
	exports: [
		RouterModule
	]
})
export class AdminRoutingModule { }
