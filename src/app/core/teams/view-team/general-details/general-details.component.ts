import { TitleCasePipe } from '@angular/common';
import { Component, DestroyRef, Input, computed, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { NgSelectModule } from '@ng-select/ng-select';
import { switchMap, tap } from 'rxjs/operators';

import { MultiSelectDirective } from '../../../../common/multi-select.directive';
import { JoinPipe } from '../../../../common/pipes/join.pipe';
import { UtcDatePipe } from '../../../../common/pipes/utc-date-pipe/utc-date.pipe';
import { SystemAlertService } from '../../../../common/system-alert/system-alert.service';
import { SessionService, UserExternalRolesSelectDirective } from '../../../auth';
import { APP_CONFIG } from '../../../tokens';
import { HasTeamRoleDirective } from '../../directives/has-team-role.directive';
import { ListTeamMembersComponent } from '../../list-team-members/list-team-members.component';
import { ListSubTeamsComponent } from '../../list-teams/list-sub-teams.component';
import { Team } from '../../team.model';
import { TeamsService } from '../../teams.service';

@Component({
	selector: 'app-general-details',
	templateUrl: './general-details.component.html',
	styleUrls: ['./general-details.component.scss'],
	standalone: true,
	imports: [
		ListTeamMembersComponent,
		HasTeamRoleDirective,
		FormsModule,
		RouterLink,
		ListSubTeamsComponent,
		TitleCasePipe,
		JoinPipe,
		UtcDatePipe,
		MultiSelectDirective,
		NgSelectModule,
		UserExternalRolesSelectDirective
	]
})
export class GeneralDetailsComponent {
	@Input({ required: true })
	team!: Team;

	_team: Team;

	isEditing = false;

	private destroyRef = inject(DestroyRef);
	private alertService = inject(SystemAlertService);
	private sessionService = inject(SessionService);
	private teamsService = inject(TeamsService);
	private config = inject(APP_CONFIG);

	nestedTeamsEnabled = computed(() => this.config()?.teams?.nestedTeams ?? false);
	implicitMembersStrategy = computed(() => this.config()?.teams?.implicitMembers?.strategy);

	edit() {
		this._team = new Team(this.team);
		this.isEditing = true;
	}

	cancelEdit() {
		this.isEditing = false;
	}

	saveEdit() {
		this.teamsService
			.update(this._team)
			.pipe(
				tap((team: Team | null) => {
					this.isEditing = false;
					if (team) {
						this.team = team;
						this.alertService.addAlert('Team updated', 'success', 5000);
					}
				}),
				switchMap(() => this.sessionService.reloadSession()),
				takeUntilDestroyed(this.destroyRef)
			)
			.subscribe();
	}
}
