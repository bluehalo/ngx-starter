import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AboutComponent } from './about.component';
import { AccessComponent } from './access.component';
import { AuthGuard } from './auth/auth.guard';
import { UserEuaComponent } from './eua/user-eua.component';
import { SigninComponent } from './signin/signin.component';
import { SignedUpComponent } from './signup/signed-up.component';
import { SignupComponent } from './signup/signup.component';
import { UnauthorizedComponent } from './unauthorized.component';

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
				path: 'signin',
				component: SigninComponent
			},
			{
				path: 'signup',
				component: SignupComponent
			},
			{
				path: 'signed-up',
				component: SignedUpComponent
			},
			{
				path: 'unauthorized',
				component: UnauthorizedComponent,
				canActivate: [AuthGuard],
				data: {
					roles: [], // no roles are needed to get to the "unauthorized" page
					requiresEua: false
				}
			},
			{
				path: 'admin',
				loadChildren: () => import('./admin/admin.module').then((m) => m.AdminModule)
			},
			{
				path: 'audit',
				loadChildren: () => import('./audit/audit.module').then((m) => m.AuditModule)
			}
		])
	],
	exports: [RouterModule]
})
export class CoreRoutingModule {}
