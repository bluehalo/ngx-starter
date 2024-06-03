import { InjectionToken, inject, makeEnvironmentProviders } from '@angular/core';
import { ROUTES } from '@angular/router';

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
