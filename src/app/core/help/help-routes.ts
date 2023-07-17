import { ActivatedRouteSnapshot, ResolveFn, Routes } from '@angular/router';

import { HelpTopicWrapperComponent } from './help-topic-wrapper.component';
import { getHelpTopicsMap } from './help-topic.component';
import { HelpComponent } from './help.component';

const breadcrumbResolver: ResolveFn<string | null> = (route: ActivatedRouteSnapshot) =>
	getHelpTopicsMap().get(route.params['topic'])?.title ?? null;

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
				path: ':topic',
				component: HelpTopicWrapperComponent,
				resolve: {
					breadcrumb: breadcrumbResolver
				}
			}
		]
	}
];
