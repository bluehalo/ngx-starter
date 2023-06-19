import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { authGuard } from '../auth/auth.guard';
import { CreateTeamComponent } from './create-team/create-team.component';
import { ListTeamsComponent } from './list-teams/list-teams.component';
import { teamResolver } from './teams.service';
import { GeneralDetailsComponent } from './view-team/general-details/general-details.component';
import { ViewTeamComponent } from './view-team/view-team.component';

@NgModule({
	imports: [
		RouterModule.forChild([
			{
				path: 'teams',
				component: ListTeamsComponent,
				canActivate: [authGuard],
				data: { roles: ['user'] }
			},
			{
				path: 'team/create',
				component: CreateTeamComponent,
				canActivate: [authGuard],
				data: { roles: ['editor', 'admin'], requireAllRoles: false }
			},
			{
				path: 'team/:id',
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
		])
	],
	exports: [RouterModule]
})
export class TeamsRoutingModule {}
