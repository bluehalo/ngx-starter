import { ViewportScroller } from '@angular/common';
import { APP_INITIALIZER, Provider, makeEnvironmentProviders } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

import { firstValueFrom } from 'rxjs';
import { tap } from 'rxjs/operators';

import { SessionService } from './auth';
import { ConfigService } from './config.service';
import { CustomViewportScroller, SCROLL_ELEMENT } from './custom_viewport_scroller';
import { NavigationService } from './navigation.service';
import { APP_CONFIG, APP_SESSION } from './tokens';

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
