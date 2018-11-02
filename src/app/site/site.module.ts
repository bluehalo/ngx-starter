import { NgModule } from '@angular/core';

import { AuthGuard } from '../core/auth/auth.guard';
import { CoreModule } from '../core/core.module';
import { HelpModule } from '../common/help.module';

import { ExampleModule } from './example/example.module';

@NgModule({
	imports: [
		CoreModule,
		HelpModule,
		ExampleModule
	],
	exports: [

	],
	declarations: [
	],
	providers: [
		AuthGuard
	]
})
export class SiteModule { }
