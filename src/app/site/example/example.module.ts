import { NgModule } from '@angular/core';

import { ExampleRoutingModule } from './example-routing.module';

import { AuthGuard } from '../../core/auth/auth.guard';
import { SearchComponent } from './search.component';
import { ExploreComponent } from './explore.component';
import { WelcomeComponent } from './welcome.component';
import { ExampleHelpComponent } from './help/example-help.component';


@NgModule({
	imports: [
		ExampleRoutingModule
	],
	entryComponents: [
		ExampleHelpComponent
	],
	exports: [
	],
	declarations: [
		ExploreComponent,
		SearchComponent,
		WelcomeComponent,
		ExampleHelpComponent
	],
	providers: [
		AuthGuard
	]
})
export class ExampleModule { }
