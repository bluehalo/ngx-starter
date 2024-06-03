import { makeEnvironmentProviders } from '@angular/core';
import { ROUTES } from '@angular/router';

import { ADMIN_TOPICS, NAVBAR_TOPICS } from '../../core';
import { HELP_TOPICS } from '../../core/help/help-topic.component';
import { EXAMPLE_ROUTES } from './example-routes';
import { ExampleHelpComponent } from './help/example-help.component';

export function provideExampleSiteFeature() {
	return makeEnvironmentProviders([
		{
			provide: ADMIN_TOPICS,
			multi: true,
			useValue: [
				{
					id: 'example',
					ordinal: 10,
					path: 'example',
					title: 'Example'
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
			provide: NAVBAR_TOPICS,
			multi: true,
			useValue: [
				{
					id: 'forms',
					title: 'Forms',
					ordinal: 1,
					path: 'forms',
					iconClass: 'fa-check-square',
					hasSomeRoles: ['user']
				},
				{
					id: 'modals',
					title: 'Modals',
					ordinal: 2,
					path: 'modal',
					iconClass: 'fa-window-restore',
					hasSomeRoles: ['user']
				},
				{
					id: 'grid',
					title: 'Grid',
					ordinal: 3,
					path: 'grid',
					iconClass: 'fa-th',
					hasSomeRoles: ['user']
				},
				{
					id: 'loading-overlay',
					title: 'Loading Overlay',
					ordinal: 4,
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
			provide: ROUTES,
			multi: true,
			useValue: EXAMPLE_ROUTES
		}
	]);
}
