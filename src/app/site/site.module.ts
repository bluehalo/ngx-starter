import { NgModule } from '@angular/core';

import { AuthGuard } from '../core/auth/auth.guard';
import { CoreModule } from '../core/core.module';

import { AdminModule } from './admin/admin.module';
import { ExampleModule } from './example/example.module';

@NgModule({
	imports: [
		CoreModule,
		AdminModule,
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
