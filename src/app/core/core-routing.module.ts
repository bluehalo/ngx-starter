import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AboutComponent } from './about.component';
import { SigninComponent } from './signin/signin.component';

@NgModule({
	imports: [
		RouterModule.forChild([
			{
				path: 'about',
				component: AboutComponent
			},
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
