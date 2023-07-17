import { Routes } from '@angular/router';

import { AdminListFeedbackComponent } from './list-feedback/admin-list-feedback.component';

export const ADMIN_FEEDBACK_ROUTES: Routes = [
	{
		path: 'feedback',
		component: AdminListFeedbackComponent
	}
];
