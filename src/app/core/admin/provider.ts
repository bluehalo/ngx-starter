import { InjectionToken, inject, makeEnvironmentProviders } from '@angular/core';
import { ROUTES } from '@angular/router';

import { ADMIN_TOPICS } from './admin-topic.model';

export const APP_FEATURE_ADMIN = new InjectionToken<boolean>('APP_FEATURE_ADMIN');

export function injectAdminEnabled() {
	return inject(APP_FEATURE_ADMIN, { optional: true }) ?? false;
}

export function provideAdminFeature() {
	return makeEnvironmentProviders([
		{
			provide: APP_FEATURE_ADMIN,
			useValue: true
		},
		{
			provide: ADMIN_TOPICS,
			multi: true,
			useValue: [
				{
					id: 'users',
					title: 'Users',
					ordinal: 0,
					path: 'users'
				},

				{
					id: 'cache-entries',
					title: 'Cache Entries',
					ordinal: 1,
					path: 'cacheEntries'
				},
				{
					id: 'end-user-agreements',
					title: 'EUAs',
					ordinal: 2,
					path: 'euas'
				},
				{
					id: 'messages',
					title: 'Messages',
					ordinal: 3,
					path: 'messages'
				},
				{
					id: 'feedback',
					title: 'Feedback',
					ordinal: 4,
					path: 'feedback'
				}
			]
		},
		{
			provide: ROUTES,
			multi: true,
			useValue: [
				{
					path: 'admin',
					loadChildren: () => import('./admin-routes').then((m) => m.ADMIN_ROUTES)
				}
			]
		}
	]);
}
