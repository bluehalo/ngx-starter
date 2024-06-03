import { InjectionToken, inject, makeEnvironmentProviders } from '@angular/core';
import { ROUTES, Routes } from '@angular/router';

import { Topic } from '../../common/topic.model';
import { TEAM_TOPICS } from './team-topic.model';

export type AdditionalTeamsRoutes = {
	topics: Topic[];
	routeLoader: () => Promise<Routes>;
};

export const APP_FEATURE_TEAM = new InjectionToken<boolean>('APP_FEATURE_TEAMS');

export function injectTeamsEnabled() {
	return inject(APP_FEATURE_TEAM, { optional: true }) ?? false;
}

export function provideTeamsFeature(additionalRoutes?: AdditionalTeamsRoutes) {
	return makeEnvironmentProviders([
		{
			provide: APP_FEATURE_TEAM,
			useValue: true
		},
		{
			provide: TEAM_TOPICS,
			multi: true,
			useValue: [
				{
					id: 'general',
					title: 'General',
					ordinal: 0,
					path: 'general'
				},
				...(additionalRoutes?.topics ?? [])
			]
		},
		{
			provide: ROUTES,
			multi: true,
			useValue: [
				{
					path: 'team',
					loadChildren: () => import('./teams-routes').then((m) => m.TEAMS_ROUTES)
				}
			]
		}
	]);
}
