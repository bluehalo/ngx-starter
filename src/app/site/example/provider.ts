import { makeEnvironmentProviders } from '@angular/core';
import { ROUTES } from '@angular/router';

import { ADMIN_TOPICS } from '../../core/admin/admin-topic.model';
import { HELP_TOPICS } from '../../core/help/help-topic.component';
import { NAVBAR_TOPICS } from '../../core/site-navbar/navbar-topic.model';
import { EXAMPLE_ROUTES } from './example-routes';
import { ExampleHelpComponent } from './help/example-help.component';

export function provideExampleRoutes() {
	return makeEnvironmentProviders([
		{
			provide: ADMIN_TOPICS,
			multi: true,
			useValue: {
				id: 'example',
				ordinal: 10,
				path: 'example',
				title: 'Example'
			}
		},
		{
			provide: NAVBAR_TOPICS,
			multi: true,
			useValue: [
				{
					id: 'explore',
					title: 'Explore',
					ordinal: 1,
					path: 'explore',
					iconClass: 'fa-compass',
					hasSomeRoles: ['user']
				},
				{
					id: 'search',
					title: 'Search',
					ordinal: 2,
					path: 'search',
					iconClass: 'fa-search',
					hasSomeRoles: ['user']
				},
				{
					id: 'forms',
					title: 'Forms',
					ordinal: 3,
					path: 'forms',
					iconClass: 'fa-check-square',
					hasSomeRoles: ['user']
				},
				{
					id: 'modals',
					title: 'Modals',
					ordinal: 4,
					path: 'modal',
					iconClass: 'fa-window-restore',
					hasSomeRoles: ['user']
				},
				{
					id: 'grid',
					title: 'Grid',
					ordinal: 5,
					path: 'grid',
					iconClass: 'fa-th',
					hasSomeRoles: ['user']
				},
				{
					id: 'loading-overlay',
					title: 'Loading Overlay',
					ordinal: 6,
					path: 'loading-overlay',
					iconClass: 'fa-spinner',
					hasSomeRoles: ['user']
				},
				{
					id: 'alerts',
					title: 'Alerts',
					ordinal: 8,
					path: 'alerts',
					iconClass: 'fa-exclamation-circle',
					hasSomeRoles: ['user']
				}
			]
		},
		{
			provide: HELP_TOPICS,
			multi: true,
			useValue: {
				id: 'example',
				component: ExampleHelpComponent,
				ordinal: 7
			}
		},
		{
			provide: ROUTES,
			multi: true,
			useValue: EXAMPLE_ROUTES
		}
	]);
}
