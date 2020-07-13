import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AdminComponent } from '../../common/admin/admin.component';

import { AuthGuard } from '../auth/auth.guard';
import { CacheEntriesComponent } from './cache-entries/cache-entries.module';
import {
	AdminCreateEuaComponent,
	AdminListEuasComponent,
	AdminUpdateEuaComponent
} from './end-user-agreement/admin-eua.module';
import { AdminListFeedbackComponent } from './feedback/admin-list-feedback.component';
import { CreateMessageComponent } from './messages/create-message.component';
import { UpdateMessageComponent } from './messages/edit-message.component';
import { ListMessagesComponent } from './messages/list-messages.component';
import { AdminCreateUserComponent } from './user-management/admin-create-user.component';
import { AdminUpdateUserComponent } from './user-management/admin-edit-user.component';
import { AdminListUsersComponent } from './user-management/admin-list-users.component';

@NgModule({
	imports: [
		RouterModule.forChild([
			{
				path: '',
				component: AdminComponent,
				canActivate: [AuthGuard],
				data: { roles: ['admin'] },
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
					 * Admin Access Checker Cache Entries Route
					 */
					{
						path: 'cacheEntries',
						component: CacheEntriesComponent
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
						path: 'messages',
						component: ListMessagesComponent
					},
					{
						path: 'message',
						component: CreateMessageComponent
					},
					{
						path: 'message/:id',
						component: UpdateMessageComponent
					},

					/**
					 * Admin Feedback Routes
					 */
					{
						path: 'feedback',
						component: AdminListFeedbackComponent
					}
				]
			}
		])
	],
	exports: [RouterModule]
})
export class AdminRoutingModule {}
