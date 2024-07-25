import { provideHttpClient, withInterceptors, withInterceptorsFromDi } from '@angular/common/http';
import { ApplicationConfig } from '@angular/core';
import { provideAnimations, provideNoopAnimations } from '@angular/platform-browser/animations';
import {
	TitleStrategy,
	provideRouter,
	withComponentInputBinding,
	withHashLocation,
	withInMemoryScrolling
} from '@angular/router';

import { provideCdkDialog } from './common/dialog';
import { provideAdminFeature } from './core/admin';
import { provideAuditFeature } from './core/audit';
import { authInterceptor } from './core/auth/auth.interceptor';
import { euaInterceptor } from './core/auth/eua.interceptor';
import { signinInterceptor } from './core/auth/signin.interceptor';
import { CORE_ROUTES } from './core/core-routes';
import { provideHelpFeature } from './core/help';
import { masqueradeInterceptor } from './core/masquerade/masquerade.interceptor';
import { PageTitleStrategy } from './core/page-title.strategy';
import {
	provideAppConfig,
	provideNavigationService,
	provideSession,
	provideViewportScroller
} from './core/provider';
import { provideTeamsFeature } from './core/teams/provider';
import { provideExampleSiteFeature } from './site/example/provider';

const disableAnimations: boolean = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const appConfig: ApplicationConfig = {
	providers: [
		!disableAnimations ? provideAnimations() : provideNoopAnimations(),
		provideHttpClient(
			withInterceptors([
				signinInterceptor,
				authInterceptor,
				euaInterceptor,
				masqueradeInterceptor
			]),
			// Ensures any legacy class based interceptors are used.
			withInterceptorsFromDi()
		),
		provideCdkDialog(),
		provideRouter(
			CORE_ROUTES,
			withHashLocation(),
			withInMemoryScrolling({ scrollPositionRestoration: 'enabled' }),
			withComponentInputBinding()
		),
		provideViewportScroller(),
		provideAppConfig(),
		provideNavigationService(),
		provideSession(),
		{
			provide: TitleStrategy,
			useClass: PageTitleStrategy
		},
		provideAuditFeature(),
		provideTeamsFeature(),
		provideAdminFeature(),
		provideHelpFeature(),
		provideExampleSiteFeature()
	]
};
