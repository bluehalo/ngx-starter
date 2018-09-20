import { NgModule } from '@angular/core';

import { AuthGuard } from '../core/auth/auth.guard';
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
	providers: [
		AuthGuard
	]
})
export class SiteModule { }
