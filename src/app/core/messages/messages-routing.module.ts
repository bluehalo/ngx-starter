import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { authGuard } from '../auth/auth.guard';
import { ViewAllMessagesComponent } from './view-all-messages/view-all-messages.component';

@NgModule({
	declarations: [],
	imports: [
		CommonModule,
		RouterModule.forChild([
			{
				path: 'messages',
				component: ViewAllMessagesComponent,
				canActivate: [authGuard],
				data: { roles: ['user'] }
			}
		])
	]
})
export class MessagesRoutingModule {}
