import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthGuard } from '../auth/auth.guard';
import { ViewAllMessagesComponent } from './view-all-messages/view-all-messages.component';

@NgModule({
	declarations: [],
	imports: [
		CommonModule,
		RouterModule.forChild([
			{
				path: 'messages',
				component: ViewAllMessagesComponent,
				canActivate: [AuthGuard],
				data: { roles: ['user'] }
			}
		])
	]
})
export class MessagesRoutingModule {}
