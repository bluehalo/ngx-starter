import { CdkTableModule } from '@angular/cdk/table';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { NgSelectModule } from '@ng-select/ng-select';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

import { DirectivesModule } from '../../common/directives.module';
import { ModalModule } from '../../common/modal.module';
import { MultiSelectInputModule } from '../../common/multi-select-input.module';
import { PipesModule } from '../../common/pipes.module';
import { SearchInputModule } from '../../common/search-input.module';
import { SystemAlertModule } from '../../common/system-alert.module';
import { TableModule } from '../../common/table.module';
import { AddMembersModalComponent } from './add-members-modal/add-members-modal.component';
import { CreateTeamComponent } from './create-team/create-team.component';
import { HasSomeTeamRolesDirective } from './directives/has-some-team-roles.directive';
import { HasTeamRoleDirective } from './directives/has-team-role.directive';
import { TeamsHelpComponent } from './help/teams-help.component';
import { ListTeamMembersComponent } from './list-team-members/list-team-members.component';
import { ListSubTeamsComponent } from './list-teams/list-sub-teams.component';
import { ListTeamsComponent } from './list-teams/list-teams.component';
import { TeamSelectInputComponent } from './team-select-input/team-select-input.component';
import { TeamTopics } from './team-topic.model';
import { TeamsRoutingModule } from './teams-routing.module';
import { GeneralDetailsComponent } from './view-team/general-details/general-details.component';
import { ViewTeamComponent } from './view-team/view-team.component';

@NgModule({
	imports: [
		BsDropdownModule.forRoot(),
		TabsModule.forRoot(),
		TooltipModule.forRoot(),

		NgSelectModule,

		CommonModule,
		FormsModule,
		DirectivesModule,
		PipesModule,
		MultiSelectInputModule,
		SystemAlertModule,
		SearchInputModule,
		ModalModule,
		CdkTableModule,
		TableModule,

		TeamsRoutingModule
	],
	declarations: [
		AddMembersModalComponent,
		CreateTeamComponent,
		ListTeamMembersComponent,
		ListTeamsComponent,
		ListSubTeamsComponent,
		ViewTeamComponent,
		TeamsHelpComponent,
		TeamSelectInputComponent,
		GeneralDetailsComponent,
		HasTeamRoleDirective,
		HasSomeTeamRolesDirective
	],
	providers: [TeamsHelpComponent]
})
export class TeamsModule {}

TeamTopics.registerTopic({
	id: 'general',
	title: 'General',
	ordinal: 0,
	path: 'general'
});
