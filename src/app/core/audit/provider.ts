import { InjectionToken, inject, makeEnvironmentProviders } from '@angular/core';
import { ROUTES } from '@angular/router';

export const APP_FEATURE_AUDIT = new InjectionToken<boolean>('APP_FEATURE_AUDIT');

export function injectAuditEnabled() {
	return inject(APP_FEATURE_AUDIT, { optional: true }) ?? false;
}

export function provideAuditFeature() {
	return makeEnvironmentProviders([
		{
			provide: APP_FEATURE_AUDIT,
			useValue: true
		},
		{
			provide: ROUTES,
			multi: true,
			useValue: [
				{
					path: 'audit',
					loadChildren: () => import('./audit-routes').then((m) => m.AUDIT_ROUTES)
				}
			]
		}
	]);
}
