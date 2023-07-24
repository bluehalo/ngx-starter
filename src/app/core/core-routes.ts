import { Routes } from '@angular/router';

import { AboutComponent } from './about.component';
import { AccessComponent } from './access.component';
import { authGuard } from './auth/auth.guard';
import { UserEuaComponent } from './eua/user-eua.component';
import { MasqueradeComponent } from './masquerade/masquerade/masquerade.component';
import { ViewAllMessagesComponent } from './messages/view-all-messages/view-all-messages.component';
import { SigninComponent } from './signin/signin.component';
import { SignedUpComponent } from './signup/signed-up.component';
import { SignupComponent } from './signup/signup.component';
import { UnauthorizedComponent } from './unauthorized.component';

export const CORE_ROUTES: Routes = [
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
		canActivate: [authGuard],
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
		canActivate: [authGuard],
		data: {
			roles: [], // no roles are needed to get to the "unauthorized" page
			requiresEua: false
		}
	},
	{
		path: 'messages',
		component: ViewAllMessagesComponent,
		canActivate: [authGuard],
		data: { roles: ['user'] }
	},
	{
		path: 'masquerade',
		component: MasqueradeComponent
	},
	{
		path: 'team',
		loadChildren: () => import('./teams/teams-routes').then((m) => m.TEAMS_ROUTES)
	},
	{
		path: 'help',
		loadChildren: () => import('./help/help-routes').then((m) => m.HELP_ROUTES)
	},
	{
		path: 'admin',
		loadChildren: () => import('./admin/admin-routes').then((m) => m.ADMIN_ROUTES)
	},
	{
		path: 'audit',
		loadChildren: () => import('./audit/audit-routes').then((m) => m.AUDIT_ROUTES)
	}
];
