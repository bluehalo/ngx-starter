import { NgModule } from '@angular/core';

import { AuthGuard, CoreModule } from '../core/core.module';

import { ExampleModule } from './example/example.module';

@NgModule({
	imports: [
		CoreModule,
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
