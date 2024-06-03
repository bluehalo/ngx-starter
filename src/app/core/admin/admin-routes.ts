import { Routes } from '@angular/router';

import { EXAMPLE_ADMIN_ROUTES } from '../../site/example/admin/admin-routes';
import { authGuard } from '../auth';
import { AdminComponent } from './admin.component';
import { ADMIN_CACHE_ENTRIES_ROUTES } from './cache-entries/admin-cache-entries-routes';
import { ADMIN_EUA_ROUTES } from './end-user-agreement/admin-eua-routes';
import { ADMIN_FEEDBACK_ROUTES } from './feedback/admin-feedback-routes';
import { ADMIN_MESSAGES_ROUTES } from './messages/admin-messages-routes';
import { ADMIN_USER_ROUTES } from './user/admin-user-routes';

export const ADMIN_ROUTES: Routes = [
	{
		path: '',
		component: AdminComponent,
		canActivate: [authGuard('admin')],
		children: [
			/**
			 * Default Route
			 */
			{
				path: '',
				redirectTo: '/admin/users',
				pathMatch: 'full'
			},
			...ADMIN_USER_ROUTES,
			...ADMIN_CACHE_ENTRIES_ROUTES,
			...ADMIN_EUA_ROUTES,
			...ADMIN_MESSAGES_ROUTES,
			...ADMIN_FEEDBACK_ROUTES,
			...EXAMPLE_ADMIN_ROUTES
		]
	}
];
