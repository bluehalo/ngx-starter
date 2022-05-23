import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { first, map, switchMap, tap } from 'rxjs/operators';

import { SystemAlertService } from '../../../../common/system-alert/system-alert.service';
import { AuthorizationService } from '../../../auth/authorization.service';
import { SessionService } from '../../../auth/session.service';
import { ConfigService } from '../../../config.service';
import { TeamAuthorizationService } from '../../team-authorization.service';
import { Team } from '../../team.model';
import { TeamsService } from '../../teams.service';

@UntilDestroy()
@Component({
	selector: 'app-general-details',
	templateUrl: './general-details.component.html',
	styleUrls: ['./general-details.component.scss']
})
export class GeneralDetailsComponent implements OnInit {
	team?: Team;
	_team: any;

	nestedTeamsEnabled = false;
	implicitMembersStrategy?: string;

	canManageTeam = false;

	isEditing = false;

	constructor(
		private router: Router,
		private route: ActivatedRoute,
		private alertService: SystemAlertService,
		private configService: ConfigService,
		private sessionService: SessionService,
		private teamsService: TeamsService,
		private authorizationService: AuthorizationService,
		private teamAuthorizationService: TeamAuthorizationService
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
			this.canManageTeam =
				this.authorizationService.isAdmin() || this.teamAuthorizationService.isAdmin(team);
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
						this.alertService.addAlert('Updated team metadata', 'success', 5000);
					}
				}),
				switchMap(() => this.sessionService.reloadSession()),
				untilDestroyed(this)
			)
			.subscribe();
	}
}
