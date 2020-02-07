import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AboutComponent } from './about.component';
import { AccessComponent } from './access.component';
import { SignedUpComponent } from './signup/signed-up.component';
import { SigninComponent } from './signin/signin.component';
import { SignupComponent } from './signup/signup.component';
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
				path: 'audit',
				loadChildren: () => import('./audit/audit.module').then(m => m.AuditModule)
			}
		])
	],
	exports: [RouterModule],
	providers: []
})
export class CoreRoutingModule {}
