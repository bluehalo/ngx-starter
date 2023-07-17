import { APP_INITIALIZER, makeEnvironmentProviders } from '@angular/core';
import { ROUTES } from '@angular/router';

import { firstValueFrom } from 'rxjs';
import { tap } from 'rxjs/operators';

import { AdminTopics } from '../common/admin/admin-topic.model';
import { ConfigService } from './config.service';
import { CORE_ROUTES } from './core-routes';
import { GettingStartedHelpComponent } from './help/getting-started/getting-started-help.component';
import { HelpTopics } from './help/help-topic.component';
import { NavigationService } from './navigation.service';
import { TeamsHelpComponent } from './teams/help/teams-help.component';

export function provideCoreRoutes() {
	// Registering Topics here.  Need to find better alternative for this.
	HelpTopics.registerTopic('getting-started', GettingStartedHelpComponent, 0);
	HelpTopics.registerTopic('teams', TeamsHelpComponent, 9);

	AdminTopics.registerTopic({
		id: 'users',
		title: 'User',
		ordinal: 0,
		path: 'users'
	});

	AdminTopics.registerTopic({
		id: 'cache-entries',
		title: 'Cache Entries',
		ordinal: 1,
		path: 'cacheEntries'
	});

	AdminTopics.registerTopic({
		id: 'end-user-agreements',
		title: 'EUAs',
		ordinal: 2,
		path: 'euas'
	});

	AdminTopics.registerTopic({
		id: 'messages',
		title: 'Messages',
		ordinal: 3,
		path: 'messages'
	});

	AdminTopics.registerTopic({
		id: 'feedback',
		title: 'Feedback',
		ordinal: 4,
		path: 'feedback'
	});

	return makeEnvironmentProviders([
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
