import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { WelcomeComponent } from './welcome/welcome.component';
import { AuthGuard } from '../core/auth/auth.guard';

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
				canActivate: [ AuthGuard ],
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
