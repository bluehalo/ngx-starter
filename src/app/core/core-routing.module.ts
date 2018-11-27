import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AboutComponent } from './about.component';
import { AccessComponent } from './access.component';
import { InactiveComponent } from './inactive.component';
import { SigninComponent } from './signin/signin.component';
import { UnauthorizedComponent } from './unauthorized.component';
import { UserEuaComponent } from './eua/user-eua.component';
import { AuthGuard } from './auth/auth.guard';

@NgModule({
	imports: [
		RouterModule.forChild([
			{
				path: 'about',
				component: AboutComponent
			},
			{
				path: 'access',
				component: AccessComponent
			},
			{
				path: 'eua',
				component: UserEuaComponent,
				canActivate: [AuthGuard],
				data: {
					requiresEua: false
				}
			},
			{
				path: 'inactive',
				component: InactiveComponent,
				canActivate: [AuthGuard],
				data: {
					requiresEua: false
				}
			},
			{
				path: 'signin',
				component: SigninComponent
			},
			{
				path: 'unauthorized',
				component: UnauthorizedComponent,
				canActivate: [AuthGuard],
				data: {
					requiresEua: false
				}
			}
		])
	],
	exports: [
		RouterModule
	],
	providers: [ ]
})

export class CoreRoutingModule {}
