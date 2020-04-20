import { Injectable, NgModule } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterModule } from '@angular/router';

import { AuthGuard } from '../auth/auth.guard';
import { HelpTopicWrapperComponent } from './help-topic-wrapper.component';
import { HelpTopics } from './help-topic.component';
import { HelpComponent } from './help.component';

@Injectable()
export class HelpBreadcrumbResolver implements Resolve<string> {
	resolve(route: ActivatedRouteSnapshot): string {
		return HelpTopics.getTopicTitle(route.params.topic);
	}
}

@NgModule({
	imports: [
		RouterModule.forChild([
			{
				path: 'help',
				component: HelpComponent,
				canActivate: [AuthGuard],
				data: { roles: ['user'] },
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
							breadcrumb: HelpBreadcrumbResolver
						}
					}
				]
			}
		])
	],
	exports: [],
	providers: [HelpBreadcrumbResolver]
})
export class HelpRoutingModule {}
