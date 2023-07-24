import { NgIf, TitleCasePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { first, map, switchMap, tap } from 'rxjs/operators';

import { MultiSelectInputComponent } from '../../../../common/multi-select-input/multi-select-input.component';
import { JoinPipe } from '../../../../common/pipes/join.pipe';
import { UtcDatePipe } from '../../../../common/pipes/utc-date-pipe/utc-date.pipe';
import { SystemAlertService } from '../../../../common/system-alert/system-alert.service';
import { SessionService } from '../../../auth/session.service';
import { ConfigService } from '../../../config.service';
import { HasTeamRoleDirective } from '../../directives/has-team-role.directive';
import { ListTeamMembersComponent } from '../../list-team-members/list-team-members.component';
import { ListSubTeamsComponent } from '../../list-teams/list-sub-teams.component';
import { Team } from '../../team.model';
import { TeamsService } from '../../teams.service';

@UntilDestroy()
@Component({
	selector: 'app-general-details',
	templateUrl: './general-details.component.html',
	styleUrls: ['./general-details.component.scss'],
	standalone: true,
	imports: [
		NgIf,
		ListTeamMembersComponent,
		HasTeamRoleDirective,
		FormsModule,
		RouterLink,
		MultiSelectInputComponent,
		ListSubTeamsComponent,
		TitleCasePipe,
		JoinPipe,
		UtcDatePipe
	]
})
export class GeneralDetailsComponent implements OnInit {
	team?: Team;
	_team: any;

	nestedTeamsEnabled = false;
	implicitMembersStrategy?: string;

	isEditing = false;

	constructor(
		private router: Router,
		private route: ActivatedRoute,
		private alertService: SystemAlertService,
		private configService: ConfigService,
		private sessionService: SessionService,
		private teamsService: TeamsService
	) {}

	ngOnInit(): void {
		this.configService
			.getConfig()
			.pipe(first(), untilDestroyed(this))
			.subscribe((config) => {
				this.implicitMembersStrategy = config?.teams?.implicitMembers?.strategy;
				this.nestedTeamsEnabled = config?.teams?.nestedTeams ?? false;
			});

		this.route.parent?.data
			.pipe(
				map((data) => data['team']),
				untilDestroyed(this)
			)
			.subscribe((team) => {
				this.updateTeam(team);
			});
	}

	updateTeam(team: Team) {
		if (team) {
			this.team = team;
		} else {
			this.router.navigate(['resource/invalid', { type: 'team' }]);
		}
	}

	edit() {
		this._team = new Team().setFromModel(this.team);
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
				untilDestroyed(this)
			)
			.subscribe();
	}
}
