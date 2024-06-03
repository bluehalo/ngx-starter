import { Routes } from '@angular/router';

import { authGuard } from '../../core';
import { AlertsComponent } from './alerts/alerts.component';
import { FormsComponent } from './forms/forms.component';
import { GridComponent } from './grid/grid.component';
import { ExampleLoadingOverlayComponent } from './loading-overlay/example-loading-overlay.component';
import { ModalComponent } from './modal/modal.component';
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
		canActivate: [authGuard()]
	},
	{
		path: 'forms',
		component: FormsComponent,
		canActivate: [authGuard()]
	},
	{
		path: 'grid',
		component: GridComponent,
		canActivate: [authGuard()]
	},
	{
		path: 'modal',
		component: ModalComponent,
		canActivate: [authGuard()]
	},
	{
		path: 'loading-overlay',
		component: ExampleLoadingOverlayComponent,
		canActivate: [authGuard()]
	},
	{
		path: 'alerts',
		component: AlertsComponent,
		canActivate: [authGuard()]
	}
];
