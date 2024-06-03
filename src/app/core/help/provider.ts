import { InjectionToken, inject, makeEnvironmentProviders } from '@angular/core';
import { ROUTES } from '@angular/router';

import { GettingStartedHelpComponent } from './getting-started/getting-started-help.component';
import { HELP_TOPICS } from './help-topic.component';

export const APP_FEATURE_HELP = new InjectionToken<boolean>('APP_FEATURE_HELP');

export function injectHelpEnabled() {
	return inject(APP_FEATURE_HELP, { optional: true }) ?? false;
}

export function provideHelpFeature() {
	return makeEnvironmentProviders([
		{
			provide: APP_FEATURE_HELP,
			useValue: true
		},
		{
			provide: HELP_TOPICS,
			multi: true,
			useValue: [
				{
					id: 'getting-started',
					title: 'Getting Started',
					ordinal: 0,
					component: GettingStartedHelpComponent
				}
			]
		},
		{
			provide: ROUTES,
			multi: true,
			useValue: [
				{
					path: 'help',
					loadChildren: () => import('./help-routes').then((m) => m.HELP_ROUTES)
				}
			]
		}
	]);
}
