import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AuthGuard } from '../auth/auth.guard';

import { AdminListFeedbackComponent } from './admin/admin-list-feedback.component';
import { AdminComponent } from '../admin/admin.module';

@NgModule({
	imports: [
		RouterModule.forChild([
			{
				path: 'admin',
				component: AdminComponent,
				canActivate: [AuthGuard],
				data: {roles: ['admin']},
				children: [
					{
						path: 'feedback',
						component: AdminListFeedbackComponent
					}
				]
			}
		])
	],
	exports: [
		RouterModule
	]
})
export class FeedbackRoutingModule { }
