import { NgModule } from '@angular/core';

import { CoreModule } from '../core/core.module';
import { SiteRoutingModule } from './site-routing.module';
import { ExampleModule } from './example/example.module';


import { WelcomeComponent } from './welcome/welcome.component';

@NgModule({
	imports: [
		CoreModule,
		SiteRoutingModule,

		ExampleModule
	],
	exports: [

	],
	declarations: [
		WelcomeComponent
	],
	providers: []
})
export class SiteModule { }
