import { Injectable, NgModule } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterModule } from '@angular/router';

import { HelpTopics } from './help-topic.component';
import { HelpComponent } from './help.component';
import { HelpTopicWrapperComponent } from './help-topic-wrapper.component';
import { AuthGuard } from '../../core/auth/auth.guard';

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
				data: { roles: [ 'user' ] },
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
			}])
	],
	exports: [
	],
	providers: [
		HelpBreadcrumbResolver
	]
})
export class HelpRoutingModule { }
