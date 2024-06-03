import { Routes } from '@angular/router';

import { EXAMPLE_HELP_ROUTES } from '../../site/example/example-help-routes';
import { TEAMS_HELP_ROUTES } from '../teams/team-help-routes';
import { GettingStartedHelpComponent } from './getting-started/getting-started-help.component';
import { HelpComponent } from './help.component';

export const HELP_ROUTES: Routes = [
	{
		path: '',
		component: HelpComponent,
		children: [
			/**
			 * Default Route
			 */
			{
				path: '',
				redirectTo: 'getting-started',
				pathMatch: 'full'
			},
			{
				path: 'getting-started',
				title: 'Getting Started',
				component: GettingStartedHelpComponent
			},
			...TEAMS_HELP_ROUTES,
			...EXAMPLE_HELP_ROUTES
		]
	}
];
