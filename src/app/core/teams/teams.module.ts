import { CdkTableModule } from '@angular/cdk/table';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { NgSelectModule } from '@ng-select/ng-select';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

import { DirectivesModule } from '../../common/directives.module';
import { ModalModule, ModalService } from '../../common/modal.module';
import { MultiSelectInputModule } from '../../common/multi-select-input.module';
import { PipesModule } from '../../common/pipes.module';
import { SearchInputModule } from '../../common/search-input.module';
import { SystemAlertModule } from '../../common/system-alert.module';
import { TableModule } from '../../common/table.module';
import { AddMembersModalComponent } from './add-members-modal/add-members-modal.component';
import { CreateTeamComponent } from './create-team/create-team.component';
import { TeamsHelpComponent } from './help/teams-help.component';
import { ListTeamMembersComponent } from './list-team-members/list-team-members.component';
import { ListTeamsComponent } from './list-teams/list-teams.component';
import { TeamAuthorizationService } from './team-authorization.service';
import { TeamSelectInputComponent } from './team-select-input/team-select-input.component';
import { TeamsRoutingModule } from './teams-routing.module';
import { TeamsResolve } from './teams.resolver';
import { TeamsService } from './teams.service';
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
		ViewTeamComponent,
		TeamsHelpComponent,
		TeamSelectInputComponent
	],
	providers: [
		TeamAuthorizationService,
		TeamsService,
		TeamsResolve,
		ModalService,
		TeamsHelpComponent
	]
})
export class TeamsModule {}
