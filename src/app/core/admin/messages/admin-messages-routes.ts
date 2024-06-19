import { Routes } from '@angular/router';

import { messageResolver } from '../../messages';
import { ListMessagesComponent } from './list-messages/list-messages.component';
import { ManageMessageComponent } from './manage-message/manage-message.component';

export const ADMIN_MESSAGES_ROUTES: Routes = [
	{
		path: 'messages',
		component: ListMessagesComponent
	},
	{
		path: 'message',
		component: ManageMessageComponent
	},
	{
		path: 'message/:id',
		resolve: {
			message: messageResolver
		},
		component: ManageMessageComponent
	}
];
