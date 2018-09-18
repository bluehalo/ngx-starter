import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { WelcomeComponent } from './welcome/welcome.component';
import { RouteGuardService } from '../core/auth/route-guard.service';

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
				canActivate: [ RouteGuardService ],
				component: WelcomeComponent,
				data: {

				}
			}
		])
	],
	exports: [
		RouterModule
	]
})
export class SiteRoutingModule { }
