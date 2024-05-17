import { ViewportScroller } from '@angular/common';
import { APP_INITIALIZER, Provider, makeEnvironmentProviders } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ROUTES } from '@angular/router';

import { firstValueFrom } from 'rxjs';
import { tap } from 'rxjs/operators';

import { ADMIN_TOPICS } from './admin/admin-topic.model';
import { SessionService } from './auth';
import { ConfigService } from './config.service';
import { CORE_ROUTES } from './core-routes';
import { CustomViewportScroller, SCROLL_ELEMENT } from './custom_viewport_scroller';
import { GettingStartedHelpComponent } from './help/getting-started/getting-started-help.component';
import { HELP_TOPICS } from './help/help-topic.component';
import { NavigationService } from './navigation.service';
import { TEAM_TOPICS } from './teams';
import { TeamsHelpComponent } from './teams/help/teams-help.component';
import { APP_CONFIG, APP_SESSION } from './tokens';

export function provideCoreRoutes() {
	// Registering Topics here.  Need to find better alternative for this.
	return makeEnvironmentProviders([
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
			provide: TEAM_TOPICS,
			multi: true,
			useValue: {
				id: 'general',
				title: 'General',
				ordinal: 0,
				path: 'general'
			}
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
				},
				{ id: 'teams', title: 'Teams', ordinal: 9, component: TeamsHelpComponent }
			]
		},
		{
			provide: ROUTES,
			multi: true,
			useValue: CORE_ROUTES
		}
	]);
}

export function provideAppConfig() {
	return makeEnvironmentProviders([
		{
			provide: APP_INITIALIZER,
			useFactory: (configService: ConfigService) => {
				return () =>
					firstValueFrom(
						configService.getConfig().pipe(
							tap((config) => {
								if (config === null) {
									throw new Error('Error loading application configuration.');
								}
							})
						)
					);
			},
			deps: [ConfigService],
			multi: true
		},
		{
			provide: APP_CONFIG,
			useFactory: (configService: ConfigService) => {
				return toSignal(configService.getConfig());
			},
			deps: [ConfigService]
		}
	]);
}

export function provideNavigationService() {
	return makeEnvironmentProviders([
		{
			provide: APP_INITIALIZER,
			useFactory: (navigationService: NavigationService) => {
				return () => {
					navigationService.init();
				};
			},
			deps: [NavigationService],
			multi: true
		}
	]);
}

export function provideViewportScroller(scrollElementID?: string) {
	const providers: Provider[] = [
		{
			provide: ViewportScroller,
			useClass: CustomViewportScroller
		}
	];
	if (scrollElementID) {
		providers.push({
			provide: SCROLL_ELEMENT,
			useValue: scrollElementID
		});
	}

	return makeEnvironmentProviders(providers);
}

export function provideSession() {
	return makeEnvironmentProviders([
		{
			provide: APP_SESSION,
			useFactory: (sessionService: SessionService) => {
				return sessionService.session;
			},
			deps: [SessionService]
		}
	]);
}
