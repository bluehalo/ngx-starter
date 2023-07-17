import { Routes } from '@angular/router';

import { AdminComponent } from '../../core/admin/admin.component';
import { authGuard } from '../../core/auth/auth.guard';
import { AdminExampleComponent } from './admin/admin-example.component';
import { AlertsComponent } from './alerts/alerts.component';
import { ExploreComponent } from './explore.component';
import { FormsComponent } from './forms/forms.component';
import { GridComponent } from './grid/grid.component';
import { ExampleLoadingOverlayComponent } from './loading-overlay/example-loading-overlay.component';
import { ModalComponent } from './modal/modal.component';
import { SearchComponent } from './search.component';
import { WelcomeComponent } from './welcome.component';

export const EXAMPLE_ROUTES: Routes = [
	{
		path: '',
		redirectTo: '/welcome',
		pathMatch: 'full'
	},
	{
		path: 'welcome',
		component: WelcomeComponent,
		canActivate: [authGuard]
	},
	{
		path: 'explore',
		component: ExploreComponent,
		canActivate: [authGuard]
	},
	{
		path: 'search',
		component: SearchComponent,
		canActivate: [authGuard]
	},
	{
		path: 'forms',
		component: FormsComponent,
		canActivate: [authGuard]
	},
	{
		path: 'grid',
		component: GridComponent,
		canActivate: [authGuard]
	},
	{
		path: 'modal',
		component: ModalComponent,
		canActivate: [authGuard]
	},
	{
		path: 'loading-overlay',
		component: ExampleLoadingOverlayComponent,
		canActivate: [authGuard]
	},
	{
		path: 'alerts',
		component: AlertsComponent,
		canActivate: [authGuard]
	},
	{
		path: 'admin',
		component: AdminComponent,
		canActivate: [authGuard],
		data: { roles: ['admin'] },
		children: [
			{
				path: 'example',
				component: AdminExampleComponent
			}
		]
	}
];
