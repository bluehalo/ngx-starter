import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

// import { AuthGuard } from './core/auth-guard.service';
// import { SigninComponent } from './admin/authentication/signin.component';
// import { UnauthorizedComponent } from './admin/authentication/unauthorized.component';
// import { UserSignupComponent } from './admin/user-management/user-signup.component';
// import { UpdateUserComponent } from './admin/user-management/edit-user.component';
// import { InvalidResourceComponent } from './core/invalid-resource.component';
// import { InvalidCertificateComponent } from './admin/authentication/invalid-certificate.component';
// import { AuditComponent } from './audit/audit.component';
// import { UserEuaComponent } from './admin/end-user-agreement/user-eua.component';
// import { NoAccessComponent } from './admin/authentication/no-access.component';
// import { InactiveComponent } from './admin/authentication/inactive.component';
// import { UserSignedUpComponent } from './admin/user-management/user-signed-up.component';
// import { RequiredOrgComponent } from './admin/required-organization/required-org.component';

@NgModule({
	imports: [
		RouterModule.forRoot(
			[
				{
					// map '/' to default route
					path: '',
					// canActivate: [AuthGuard],
					redirectTo: '/welcome',
					pathMatch: 'full'
				},

				// {
				// 	path: 'signin',
				// 	component: SigninComponent,
				// 	canActivate: [AuthGuard],
				// 	data: {
				// 		requiresAuthentication: false,
				// 		roles: []
				// 	}
				// },
				// {
				// 	path: 'unauthorized',
				// 	component: UnauthorizedComponent,
				// 	canActivate: [AuthGuard],
				// 	data: {
				// 		requiresAuthentication: false,
				// 		roles: []
				// 	}
				// },
				// {
				// 	path: 'signup',
				// 	component: UserSignupComponent,
				// 	canActivate: [AuthGuard],
				// 	data: {
				// 		requiresAuthentication: false,
				// 		roles: []
				// 	}
				// },
				// {
				// 	path: 'signed-up',
				// 	component: UserSignedUpComponent,
				// 	canActivate: [AuthGuard],
				// 	data: {
				// 		requiresAuthentication: false,
				// 		roles: []
				// 	}
				// },
				// {
				// 	path: 'update-user',
				// 	canActivate: [AuthGuard],
				// 	component: UpdateUserComponent,
				// 	data: { roles: [] }
				// },
				// {
				// 	path: 'resource/invalid',
				// 	canActivate: [AuthGuard],
				// 	component: InvalidResourceComponent,
				// 	data: { roles: [] }
				// },
				// {
				// 	path: 'invalid-certificate',
				// 	canActivate: [AuthGuard],
				// 	component: InvalidCertificateComponent,
				// 	data: {
				// 		requiresAuthentication: false,
				// 		roles: []
				// 	}
				// },
				// {
				// 	path: 'audit',
				// 	canActivate: [AuthGuard],
				// 	component: AuditComponent,
				// 	data: {
				// 		roles: ['auditor']
				// 	}
				// },
				// {
				// 	path: 'user-eua',
				// 	canActivate: [AuthGuard],
				// 	component: UserEuaComponent
				// },
				// {
				// 	path: 'required-org',
				// 	canActivate: [AuthGuard],
				// 	component: RequiredOrgComponent
				// },
				// {
				// 	path: 'no-access',
				// 	canActivate: [AuthGuard],
				// 	component: NoAccessComponent,
				// 	data: {
				// 		requiresAuthentication: false
				// 	}
				// },
				// {
				// 	path: 'inactive-user',
				// 	canActivate: [AuthGuard],
				// 	component: InactiveComponent,
				// 	data: { roles: [] }
				// }
			],
			{
				useHash: true
			})
	],
	exports: [
		RouterModule
	]
})

export class AppRoutingModule {}
