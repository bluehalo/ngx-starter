import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { filter, first, map, switchMap, tap } from 'rxjs/operators';

import { ModalAction } from '../../../common/modal/modal.model';
import { ModalService } from '../../../common/modal/modal.service';
import { SystemAlertService } from '../../../common/system-alert/system-alert.service';
import { AuthorizationService } from '../../auth/authorization.service';
import { SessionService } from '../../auth/session.service';
import { ConfigService } from '../../config.service';
import { TeamAuthorizationService } from '../team-authorization.service';
import { TeamTopic, TeamTopics } from '../team-topic.model';
import { Team } from '../team.model';
import { TeamsService } from '../teams.service';

@UntilDestroy()
@Component({
	selector: 'app-view-team',
	templateUrl: './view-team.component.html',
	styleUrls: ['./view-team.component.scss']
})
export class ViewTeamComponent implements OnInit {
	topics: TeamTopic[] = [];
	team?: Team;
	_team: any;

	nestedTeamsEnabled = false;
	implicitMembersStrategy?: string;

	canManageTeam = false;

	isEditing = false;

	constructor(
		private router: Router,
		private route: ActivatedRoute,
		private modalService: ModalService,
		private configService: ConfigService,
		private teamsService: TeamsService,
		private alertService: SystemAlertService,
		private authorizationService: AuthorizationService,
		private sessionService: SessionService,
		private teamAuthorizationService: TeamAuthorizationService
	) {
		this.topics = TeamTopics.getTopics();
	}

	ngOnInit() {
		this.configService
			.getConfig()
			.pipe(first(), untilDestroyed(this))
			.subscribe((config) => {
				this.implicitMembersStrategy = config?.teams?.implicitMembers?.strategy;
				this.nestedTeamsEnabled = config?.teams?.nestedTeams ?? false;
			});

		this.route.data
			.pipe(
				map((data) => data['team']),
				untilDestroyed(this)
			)
			.subscribe((team) => {
				this.updateTeam(team);
			});
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

	updateTeam(team: Team) {
		if (team) {
			this.team = team;
			this.canManageTeam =
				this.authorizationService.isAdmin() || this.teamAuthorizationService.isAdmin(team);
		} else {
			this.router.navigate(['resource/invalid', { type: 'team' }]);
		}
	}

	remove(team: Team) {
		this.modalService
			.confirm(
				'Delete team?',
				`Are you sure you want to delete the team: <strong>"${team.name}"</strong>?<br/>This action cannot be undone.`,
				'Delete'
			)
			.pipe(
				first(),
				filter((action) => action === ModalAction.OK),
				switchMap(() => this.teamsService.delete(team)),
				switchMap(() => this.sessionService.reloadSession()),
				untilDestroyed(this)
			)
			.subscribe(() => this.router.navigate(['/teams', { clearCachedFilter: true }]));
	}
}
