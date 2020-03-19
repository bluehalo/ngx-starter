import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AuthGuard } from '../../core/auth/auth.guard';
import { ExploreComponent } from './explore.component';
import { FormsComponent } from './forms/forms.component';
import { SearchComponent } from './search.component';
import { WelcomeComponent } from './welcome.component';
import { GridComponent } from './grid/grid.component';
import { AdminExampleComponent } from './admin/admin-example.component';
import { AdminComponent } from '../../common/admin.module';
import { ModalComponent } from './modal/modal.component';

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
