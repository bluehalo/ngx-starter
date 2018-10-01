import { NgModule } from '@angular/core';

import { ExampleRoutingModule } from './example-routing.module';

import { AuthGuard } from '../../core/auth/auth.guard';
import { SearchComponent } from './search.component';
import { ExploreComponent } from './explore.component';
import { WelcomeComponent } from './welcome.component';


@NgModule({
	imports: [
		ExampleRoutingModule
	],
	exports: [
	],
	declarations: [
		ExploreComponent,
		SearchComponent,
		WelcomeComponent
	],
	providers: [
		AuthGuard
	]
})
export class ExampleModule { }
