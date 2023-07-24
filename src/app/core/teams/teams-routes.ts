import { Routes } from '@angular/router';

import { authGuard } from '../auth/auth.guard';
import { CreateTeamComponent } from './create-team/create-team.component';
import { ListTeamsComponent } from './list-teams/list-teams.component';
import { teamResolver } from './teams.service';
import { GeneralDetailsComponent } from './view-team/general-details/general-details.component';
import { ViewTeamComponent } from './view-team/view-team.component';

export const TEAMS_ROUTES: Routes = [
	{
		path: '',
		component: ListTeamsComponent,
		canActivate: [authGuard],
		data: { roles: ['user'] }
	},
	{
		path: 'create',
		component: CreateTeamComponent,
		canActivate: [authGuard],
		data: { roles: ['editor', 'admin'], requireAllRoles: false }
	},
	{
		path: ':id',
		component: ViewTeamComponent,
		canActivate: [authGuard],
		data: { roles: ['user'] },
		resolve: {
			team: teamResolver
		},
		children: [
			/**
			 * Default Route
			 */
			{
				path: '',
				redirectTo: 'general',
				pathMatch: 'full'
			},
			{
				path: 'general',
				component: GeneralDetailsComponent
			}
		]
	}
];
