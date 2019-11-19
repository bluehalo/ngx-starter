import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AuthGuard } from '../../core/auth/auth.guard';
import { ExploreComponent } from './explore.component';
import { FormsComponent } from './forms/forms.component';
import { SearchComponent } from './search.component';
import { WelcomeComponent } from './welcome.component';
import { GridComponent } from './grid/grid.component';
import { ChartComponent } from './chart/chart.component';

@NgModule({
	imports: [
		RouterModule.forChild([
			{
				path: '',
				redirectTo: '/welcome',
				pathMatch: 'full'
			},
			{
				path: 'welcome',
				component: WelcomeComponent,
				canActivate: [ AuthGuard ]
			},
			{
				path: 'explore',
				component: ExploreComponent,
				canActivate: [ AuthGuard ]
			},
			{
				path: 'chart',
				component: ChartComponent,
				canActivate: [ AuthGuard ]
			},
			{
				path: 'search',
				component: SearchComponent,
				canActivate: [ AuthGuard ]
			},
			{
				path: 'forms',
				component: FormsComponent,
				canActivate: [ AuthGuard ]
			},
			{
				path: 'grid',
				component: GridComponent,
				canActivate: [ AuthGuard ]
			}
		])
	],
	exports: [
		RouterModule
	]
})
export class ExampleRoutingModule { }
