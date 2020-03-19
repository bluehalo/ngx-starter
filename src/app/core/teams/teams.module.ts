import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';

import { ModalModule, ModalService } from '../../common/modal.module';
import { MultiSelectInputModule } from '../../common/multi-select-input.module';
import { SystemAlertModule } from '../../common/system-alert.module';
import { PagingModule } from '../../common/paging.module';
import { DirectivesModule } from '../../common/directives.module';
import { PipesModule } from '../../common/pipes.module';
import { SearchInputModule } from '../../common/search-input.module';

import { AddMembersModalComponent } from './add-members-modal/add-members-modal.component';
import { CreateTeamComponent } from './create-team/create-team.component';
import { ListTeamMembersComponent } from './list-team-members/list-team-members.component';
import { ListTeamsComponent } from './list-teams/list-teams.component';
import { ViewTeamComponent } from './view-team/view-team.component';
import { TeamsHelpComponent } from './help/teams-help.component';

import { TeamAuthorizationService } from './team-authorization.service';
import { TeamsService } from './teams.service';
import { TeamsResolve } from './teams.resolver';
import { TeamsRoutingModule } from './teams-routing.module';

@NgModule({
	imports: [
		BsDropdownModule.forRoot(),
		TabsModule.forRoot(),
		TypeaheadModule.forRoot(),
		TooltipModule.forRoot(),

		CommonModule,
		FormsModule,
		DirectivesModule,
		PipesModule,
		MultiSelectInputModule,
		SystemAlertModule,
		PagingModule,
		SearchInputModule,
		ModalModule,

		TeamsRoutingModule
	],
	entryComponents: [AddMembersModalComponent, TeamsHelpComponent],
	declarations: [
		AddMembersModalComponent,
		CreateTeamComponent,
		ListTeamMembersComponent,
		ListTeamsComponent,
		ViewTeamComponent,
		TeamsHelpComponent
	],
	providers: [TeamAuthorizationService, TeamsService, TeamsResolve, ModalService]
})
export class TeamsModule {}
