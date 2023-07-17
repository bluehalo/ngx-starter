import { Routes } from '@angular/router';

import { CreateMessageComponent } from './create-message.component';
import { UpdateMessageComponent } from './edit-message.component';
import { ListMessagesComponent } from './list-messages/list-messages.component';

export const ADMIN_MESSAGES_ROUTES: Routes = [
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
];
