import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { RouteGuardService } from './auth/route-guard.service';
import { SigninComponent } from './signin/signin.component';

@NgModule({
	imports: [
		RouterModule.forChild([
			{
				path: 'signin',
				component: SigninComponent
			}
		])
	],
	exports: [
		RouterModule
	],
	providers: [ ]
})

export class CoreRoutingModule {}
