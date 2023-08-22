import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import {
	ActivatedRoute,
	Router,
	RouterLink,
	RouterLinkActive,
	RouterOutlet
} from '@angular/router';

import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { filter, first, map, switchMap } from 'rxjs/operators';

import { DialogAction, DialogService } from '../../../common/dialog';
import { SystemAlertComponent } from '../../../common/system-alert/system-alert.component';
import { SystemAlertService } from '../../../common/system-alert/system-alert.service';
import { SessionService } from '../../auth/session.service';
import { HasTeamRoleDirective } from '../directives/has-team-role.directive';
import { getTeamTopics } from '../team-topic.model';
import { Team } from '../team.model';
import { TeamsService } from '../teams.service';

@UntilDestroy()
@Component({
	selector: 'app-view-team',
	templateUrl: './view-team.component.html',
	styleUrls: ['./view-team.component.scss'],
	standalone: true,
	imports: [
		NgIf,
		SystemAlertComponent,
		RouterLink,
		HasTeamRoleDirective,
		NgFor,
		RouterLinkActive,
		RouterOutlet
	]
})
export class ViewTeamComponent implements OnInit {
	topics = getTeamTopics();
	team?: Team;

	private dialogService = inject(DialogService);

	constructor(
		private router: Router,
		private route: ActivatedRoute,
		private teamsService: TeamsService,
		private alertService: SystemAlertService,
		private sessionService: SessionService
	) {}

	ngOnInit() {
		this.route.data
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

	remove(team: Team) {
		this.dialogService
			.confirm(
				'Delete team?',
				`Are you sure you want to delete the team: <strong>"${team.name}"</strong>?<br/>This action cannot be undone.`,
				'Delete'
			)
			.closed.pipe(
				first(),
				filter((result) => result?.action === DialogAction.OK),
				switchMap(() => this.teamsService.delete(team)),
				switchMap(() => this.sessionService.reloadSession()),
				untilDestroyed(this)
			)
			.subscribe(() => this.router.navigate(['/team']));
	}
}
