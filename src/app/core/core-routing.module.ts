import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

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
