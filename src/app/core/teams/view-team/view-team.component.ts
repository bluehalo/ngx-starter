import { NgFor, NgIf } from '@angular/common';
import { Component, DestroyRef, Input, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { filter, first, switchMap } from 'rxjs/operators';

import { DialogAction, DialogService } from '../../../common/dialog';
import { SystemAlertComponent } from '../../../common/system-alert/system-alert.component';
import { SessionService } from '../../auth/session.service';
import { HasTeamRoleDirective } from '../directives/has-team-role.directive';
import { getTeamTopics } from '../team-topic.model';
import { Team } from '../team.model';
import { TeamsService } from '../teams.service';

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
export class ViewTeamComponent {
	topics = getTeamTopics();

	@Input()
	team?: Team;

	private destroyRef = inject(DestroyRef);
	private dialogService = inject(DialogService);

	private router = inject(Router);
	private teamsService = inject(TeamsService);
	private sessionService = inject(SessionService);

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
				takeUntilDestroyed(this.destroyRef)
			)
			.subscribe(() => this.router.navigate(['/team']));
	}
}
