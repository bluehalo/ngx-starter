import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AdminComponent } from '../../common/admin.module';

import { AuthGuard } from '../../core/auth/auth.guard';

import { AdminExampleComponent } from './admin/admin-example.component';
import { ExploreComponent } from './explore.component';
import { FormsComponent } from './forms/forms.component';
import { GridComponent } from './grid/grid.component';
import { ModalComponent } from './modal/modal.component';
import { SearchComponent } from './search.component';
import { WelcomeComponent } from './welcome.component';

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
				canActivate: [AuthGuard]
			},
			{
				path: 'explore',
				component: ExploreComponent,
				canActivate: [AuthGuard]
			},
			{
				path: 'search',
				component: SearchComponent,
				canActivate: [AuthGuard]
			},
			{
				path: 'forms',
				component: FormsComponent,
				canActivate: [AuthGuard]
			},
			{
				path: 'grid',
				component: GridComponent,
				canActivate: [AuthGuard]
			},
			{
				path: 'modal',
				component: ModalComponent,
				canActivate: [AuthGuard]
			},
			{
				path: 'admin',
				component: AdminComponent,
				canActivate: [AuthGuard],
				data: { roles: ['admin'] },
				children: [
					{
						path: 'example',
						component: AdminExampleComponent
					}
				]
			}
		])
	],
	exports: [RouterModule]
})
export class ExampleRoutingModule {}
