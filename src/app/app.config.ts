import { provideHttpClient, withInterceptors, withInterceptorsFromDi } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { ApplicationConfig } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { TitleStrategy, provideRouter, withHashLocation } from '@angular/router';

import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

import { provideCdkDialog } from './common/dialog/provider';
import { authInterceptor } from './core/auth/auth.interceptor';
import { euaInterceptor } from './core/auth/eua.interceptor';
import { signinInterceptor } from './core/auth/signin.interceptor';
import { masqueradeInterceptor } from './core/masquerade/masquerade.interceptor';
import { PageTitleStrategy } from './core/page-title.strategy';
import { provideAppConfig, provideCoreRoutes, provideNavigationService } from './core/provider';
import { provideExampleRoutes } from './site/example/provider';

export const appConfig: ApplicationConfig = {
	providers: [
		importProvidersFrom(
			BsDatepickerModule.forRoot(),
			TooltipModule.forRoot(),
			// only used by modal example.  no longer used for any core functionality.
			ModalModule.forRoot()
			// ngx-bootstrap modules - If still using uncomment imports below.
			// AlertModule.forRoot(),
			// BsDropdownModule.forRoot(),
			// PopoverModule.forRoot(),
			// TypeaheadModule.forRoot()
		),
		provideAnimations(),
		provideHttpClient(
			withInterceptors([
				signinInterceptor,
				euaInterceptor,
				authInterceptor,
				masqueradeInterceptor
			]),
			// Ensures any legacy class based interceptors are used.
			withInterceptorsFromDi()
		),
		provideCdkDialog(),
		provideRouter([], withHashLocation()),
		provideCoreRoutes(),
		provideExampleRoutes(),
		provideAppConfig(),
		provideNavigationService(),
		{
			provide: TitleStrategy,
			useClass: PageTitleStrategy
		}
	]
};
