import { provideHttpClient, withInterceptors, withInterceptorsFromDi } from '@angular/common/http';
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import {
	TitleStrategy,
	provideRouter,
	withComponentInputBinding,
	withHashLocation,
	withInMemoryScrolling
} from '@angular/router';

import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

import { provideCdkDialog } from './common/dialog/provider';
import { authInterceptor } from './core/auth/auth.interceptor';
import { euaInterceptor } from './core/auth/eua.interceptor';
import { signinInterceptor } from './core/auth/signin.interceptor';
import { masqueradeInterceptor } from './core/masquerade/masquerade.interceptor';
import { PageTitleStrategy } from './core/page-title.strategy';
import {
	provideAppConfig,
	provideCoreRoutes,
	provideNavigationService,
	provideSession,
	provideViewportScroller
} from './core/provider';
import { provideExampleRoutes } from './site/example/provider';

export const appConfig: ApplicationConfig = {
	providers: [
		importProvidersFrom(BsDatepickerModule.forRoot(), TooltipModule.forRoot()),
		provideAnimations(),
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
			[],
			withHashLocation(),
			withInMemoryScrolling({ scrollPositionRestoration: 'enabled' }),
			withComponentInputBinding()
		),
		provideViewportScroller(),
		provideCoreRoutes(),
		provideExampleRoutes(),
		provideAppConfig(),
		provideNavigationService(),
		provideSession(),
		{
			provide: TitleStrategy,
			useClass: PageTitleStrategy
		}
	]
};
