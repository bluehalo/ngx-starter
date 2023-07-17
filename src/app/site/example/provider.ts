import { makeEnvironmentProviders } from '@angular/core';
import { ROUTES } from '@angular/router';

import { HelpTopics } from '../../core/help/help-topic.component';
import { EXAMPLE_ROUTES } from './example-routes';
import { ExampleHelpComponent } from './help/example-help.component';

export function provideExampleRoutes() {
	// Registering Topics here.  Need to find better alternative for this.
	HelpTopics.registerTopic('example', ExampleHelpComponent, 7);

	return makeEnvironmentProviders([
		{
			provide: ROUTES,
			multi: true,
			useValue: EXAMPLE_ROUTES
		}
	]);
}
