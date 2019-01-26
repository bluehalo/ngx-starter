import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AuthGuard } from '@core/auth/auth.guard';
import { ExploreComponent } from './explore.component';
import { SearchComponent } from './search.component';
import { WelcomeComponent } from './welcome.component';


@NgModule({
	imports: [
		RouterModule.forChild([
			{
				path: '',
				redirectTo: '/welcome',
				pathMatch: 'full'
			},
			{
				path: 'welcome',
				component: WelcomeComponent,
				canActivate: [ AuthGuard ]
			},
			{
				path: 'explore',
				component: ExploreComponent,
				canActivate: [ AuthGuard ]
			},
			{
				path: 'search',
				component: SearchComponent,
				canActivate: [ AuthGuard ]
			}
		])
	],
	exports: [
		RouterModule
	]
})
export class ExampleRoutingModule { }
