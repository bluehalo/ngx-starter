import { ActivatedRouteSnapshot, Route, Routes } from '@angular/router';

import { authGuard } from '../auth';
import { CreateTeamComponent } from './create-team/create-team.component';
import { ListTeamsComponent } from './list-teams/list-teams.component';
import { teamResolver } from './teams.service';
import { GeneralDetailsComponent } from './view-team/general-details/general-details.component';
import { ViewTeamComponent } from './view-team/view-team.component';

export const TEAMS_ROUTES: Routes = [
	{
		path: '',
		component: ListTeamsComponent,
		canActivate: [authGuard()]
	},
	{
		path: 'create',
		component: CreateTeamComponent,
		canActivate: [authGuard({ roles: ['editor', 'admin'], requireAllRoles: false })]
	},
	{
		path: ':id',
		component: ViewTeamComponent,
		canActivate: [authGuard()],
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
			} as Route,
			{
				path: 'general',
				component: GeneralDetailsComponent,
				resolve: {
					team: (route: ActivatedRouteSnapshot) => route.parent?.data['team']
				}
			}
		]
	}
];
