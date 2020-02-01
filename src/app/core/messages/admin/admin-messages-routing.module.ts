import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AdminComponent } from '../../admin/admin.component';
import { ListMessagesComponent } from './list-messages.component';
import { CreateMessageComponent } from './create-message.component';
import { UpdateMessageComponent } from './edit-message.component';
import { AuthGuard } from '../../auth/auth.guard';

@NgModule({
	imports: [
		RouterModule.forChild([
			{
				path: 'admin',
				component: AdminComponent,
				canActivate: [AuthGuard],
				data: { roles: ['admin'] },
				children: [
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
					}
				]
			}
		])
	],
	exports: []
})
export class AdminMessagesRoutingModule {}
