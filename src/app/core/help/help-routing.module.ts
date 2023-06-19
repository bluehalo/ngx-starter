import { NgModule } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn, RouterModule } from '@angular/router';

import { HelpTopicWrapperComponent } from './help-topic-wrapper.component';
import { HelpTopics } from './help-topic.component';
import { HelpComponent } from './help.component';

const breadcrumbResolver: ResolveFn<string | null> = (route: ActivatedRouteSnapshot) =>
	HelpTopics.getTopicTitle(route.params['topic']);

@NgModule({
	imports: [
		RouterModule.forChild([
			{
				path: 'help',
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
		])
	],
	exports: []
})
export class HelpRoutingModule {}
