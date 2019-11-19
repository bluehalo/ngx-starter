import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgSelectModule } from '@ng-select/ng-select';
import { SentioModule } from '@asymmetrik/ngx-sentio';

import { ExampleRoutingModule } from './example-routing.module';

import { AuthGuard } from '../../core/core.module';
import { SearchComponent } from './search.component';
import { ExploreComponent } from './explore.component';
import { WelcomeComponent } from './welcome.component';
import { ExampleHelpComponent } from './help/example-help.component';
import { FormsComponent } from './forms/forms.component';
import { GridComponent } from './grid/grid.component';
import { ChartComponent } from './chart/chart.component';

@NgModule({
	imports: [
		CommonModule,
		ExampleRoutingModule,
		NgSelectModule,
		SentioModule
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
		ExampleHelpComponent,
		FormsComponent,
		GridComponent,
		ChartComponent
	],
	providers: [
		AuthGuard
	]
})
export class ExampleModule { }
