import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AdvancedComponent } from './advanced.component';
import { ExploreComponent } from './explore.component';
import { SearchComponent } from './search.component';

@NgModule({
	imports: [
		RouterModule.forChild([
			{
				path: 'advanced',
				component: AdvancedComponent
			},
			{
				path: 'explore',
				component: ExploreComponent
			},
			{
				path: 'search',
				component: SearchComponent,
			}
		])
	],
	exports: [
		RouterModule
	]
})
export class ExampleRoutingModule { }
