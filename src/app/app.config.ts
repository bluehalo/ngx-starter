import { provideHttpClient, withInterceptors, withInterceptorsFromDi } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { ApplicationConfig } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { TitleStrategy, provideRouter, withHashLocation } from '@angular/router';

import { AlertModule } from 'ngx-bootstrap/alert';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';

import { providerCdkDialog } from './common/dialog/provider';
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
			AlertModule.forRoot(),
			BsDatepickerModule.forRoot(),
			BsDropdownModule.forRoot(),
			ModalModule.forRoot(),
			PopoverModule.forRoot(),
			TabsModule.forRoot(),
			TooltipModule.forRoot(),
			TypeaheadModule.forRoot()
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
		providerCdkDialog(),
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
